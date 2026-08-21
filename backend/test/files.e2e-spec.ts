import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Test, TestingModule } from '@nestjs/testing';
import cookieParser from 'cookie-parser';;
import { existsSync } from 'fs';
import { mkdir, readFile, unlink } from 'fs/promises';
import type { Server } from 'http';
import { basename, join } from 'path';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { AllExceptionsFilter } from './../src/common/filters/all-exceptions.filter';

interface UploadFileResponse {
  url: string;
}

interface ErrorResponse {
  statusCode: number;
  message: string | string[];
}

describe('FilesController (e2e)', () => {
  let app: NestExpressApplication;
  let httpServer: Server;

  const fixturesPath = join(__dirname, 'fixtures');
  const uploadsPath = join(process.cwd(), 'public', 'uploads');
  const uploadedFiles = new Set<string>();

  const rememberUploadedFile = (url: string): string => {
    const fileName = basename(url);

    uploadedFiles.add(fileName);

    return fileName;
  };

  const removeUploadedFiles = async (): Promise<void> => {
    await Promise.all(
      [...uploadedFiles].map(async (fileName) => {
        const filePath = join(uploadsPath, fileName);

        if (existsSync(filePath)) {
          await unlink(filePath);
        }
      }),
    );

    uploadedFiles.clear();
  };

  beforeAll(async () => {
    await mkdir(uploadsPath, { recursive: true });

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestExpressApplication>();

    // Повторяем глобальные настройки из src/main.ts.
    app.use(cookieParser());
    app.setGlobalPrefix('api');
    app.useStaticAssets(join(process.cwd(), 'public'));
    app.useGlobalFilters(new AllExceptionsFilter());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get(Reflector)),
    );

    await app.init();

    httpServer = app.getHttpServer();
  });

  afterEach(async () => {
    await removeUploadedFiles();
  });

  afterAll(async () => {
    await removeUploadedFiles();
    await app.close();
  });

  describe('POST /api/files/upload', () => {
    it('загружает изображение и возвращает URL сохранённого файла', async () => {
      const fixturePath = join(fixturesPath, 'test-image.png');

      const response = await request(httpServer)
        .post('/api/files/upload')
        .attach('file', fixturePath)
        .expect(201);

      const body = response.body as UploadFileResponse;
      const uploadedFileName = rememberUploadedFile(body.url);

      expect(body).toEqual({
        url: expect.stringMatching(
          /^\/uploads\/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.png$/i,
        ) as string,
      });

      const uploadedFilePath = join(uploadsPath, uploadedFileName);

      expect(existsSync(uploadedFilePath)).toBe(true);

      await expect(readFile(uploadedFilePath)).resolves.toEqual(
        await readFile(fixturePath),
      );
    });

    it('позволяет получить загруженное изображение по возвращённому URL', async () => {
      const fixturePath = join(fixturesPath, 'test-image.png');

      const uploadResponse = await request(httpServer)
        .post('/api/files/upload')
        .attach('file', fixturePath)
        .expect(201);

      const uploadBody = uploadResponse.body as UploadFileResponse;

      rememberUploadedFile(uploadBody.url);

      const downloadResponse = await request(httpServer)
        .get(uploadBody.url)
        .expect('Content-Type', /image\/png/)
        .expect(200);

      expect(downloadResponse.body as Buffer).toEqual(
        await readFile(fixturePath),
      );
    });

    it('возвращает 400, если файл не передан', async () => {
      const response = await request(httpServer)
        .post('/api/files/upload')
        .expect(400);

      const body = response.body as ErrorResponse;

      expect(body).toEqual(
        expect.objectContaining({
          statusCode: 400,
          message: 'Файл не загружен',
        }),
      );
    });

    it('возвращает 400 для файла недопустимого формата', async () => {
      const response = await request(httpServer)
        .post('/api/files/upload')
        .attach('file', join(fixturesPath, 'invalid-file.txt'))
        .expect(400);

      const body = response.body as ErrorResponse;

      expect(body).toEqual(
        expect.objectContaining({
          statusCode: 400,
          message: 'Недопустимый формат файла. Разрешены: JPEG, PNG, GIF, WEBP',
        }),
      );
    });

    it('отклоняет изображение размером больше 2 MB', async () => {
      const response = await request(httpServer)
        .post('/api/files/upload')
        .attach('file', join(fixturesPath, 'too-large-image.png'))
        .expect(413);

      const body = response.body as ErrorResponse;

      expect(body).toEqual(
        expect.objectContaining({
          statusCode: 413,
          message: 'File too large',
        }),
      );
    });
  });
});
