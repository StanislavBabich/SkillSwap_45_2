import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import * as cookieParser from 'cookie-parser';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { AllExceptionsFilter } from './../src/common/filters/all-exceptions.filter';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  const testUser = {
    name: 'E2E Test User',
    email: `e2e-auth-${Date.now()}@example.com`,
    password: 'Test12345',
  };

  let accessToken: string;
  let refreshToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Повторяем глобальные настройки из src/main.ts
    app.use(cookieParser());
    app.setGlobalPrefix('api');
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
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/auth/register', () => {
    it('регистрирует нового пользователя', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(testUser)
        .expect(201);

      expect(response.body).toEqual(
        expect.objectContaining({
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
          user: expect.objectContaining({
            id: expect.any(String),
            name: testUser.name,
            email: testUser.email,
          }),
        }),
      );

      accessToken = response.body.accessToken;
      refreshToken = response.body.refreshToken;
    });

    it('возвращает 409 при повторной регистрации того же email', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send(testUser)
        .expect(409);

      expect(response.body).toEqual(
        expect.objectContaining({
          statusCode: 409,
          message: 'Пользователь с таким email уже существует',
        }),
      );
    });

    it('возвращает 400 при некорректном email', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'incorrect-email',
          password: 'Test12345',
        })
        .expect(400);

      expect(response.body).toEqual(
        expect.objectContaining({
          statusCode: 400,
        }),
      );

      expect(response.body.message).toEqual(
        expect.arrayContaining(['Некорректный email']),
      );
    });

    it('возвращает 400, если передано лишнее поле', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: `extra-field-${Date.now()}@example.com`,
          password: 'Test12345',
          role: 'admin',
        })
        .expect(400);

      expect(response.body).toEqual(
        expect.objectContaining({
          statusCode: 400,
        }),
      );
    });
  });

  describe('POST /api/auth/login', () => {
    it('авторизует зарегистрированного пользователя', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
          user: expect.objectContaining({
            id: expect.any(String),
            name: testUser.name,
            email: testUser.email,
          }),
        }),
      );

      // После входа refresh token в БД обновляется,
      // поэтому дальше используем именно новые токены.
      accessToken = response.body.accessToken;
      refreshToken = response.body.refreshToken;
    });

    it('возвращает 401 при неправильном пароле', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'WrongPassword1',
        })
        .expect(401);

      expect(response.body).toEqual(
        expect.objectContaining({
          statusCode: 401,
          message: 'Неверный email или пароль',
        }),
      );
    });

    it('возвращает 401 для несуществующего пользователя', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: `unknown-${Date.now()}@example.com`,
          password: 'Test12345',
        })
        .expect(401);

      expect(response.body).toEqual(
        expect.objectContaining({
          statusCode: 401,
          message: 'Неверный email или пароль',
        }),
      );
    });

    it('возвращает 400 при некорректных данных', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'not-an-email',
          password: '123',
        })
        .expect(400);

      expect(response.body).toEqual(
        expect.objectContaining({
          statusCode: 400,
        }),
      );

      expect(response.body.message).toEqual(
        expect.arrayContaining([
          'Некорректный email',
          'Пароль должен содержать минимум 6 символов',
        ]),
      );
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('обновляет access и refresh токены', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/refresh')
        .send({ refreshToken })
        .expect(200);

      expect(response.body).toEqual({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      });

      accessToken = response.body.accessToken;
      refreshToken = response.body.refreshToken;
    });

    it('возвращает 401 без refresh token', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/refresh')
        .send({})
        .expect(401);

      expect(response.body).toEqual(
        expect.objectContaining({
          statusCode: 401,
        }),
      );
    });

    it('возвращает 401 с некорректным refresh token', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/refresh')
        .send({
          refreshToken: 'incorrect-refresh-token',
        })
        .expect(401);

      expect(response.body).toEqual(
        expect.objectContaining({
          statusCode: 401,
        }),
      );
    });
  });

  describe('POST /api/auth/logout', () => {
    it('возвращает 401 без access token', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/logout')
        .expect(401);

      expect(response.body).toEqual(
        expect.objectContaining({
          statusCode: 401,
        }),
      );
    });

    it('завершает сессию авторизованного пользователя', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body).toEqual({
        message: 'Вы успешно вышли из аккаунта',
      });
    });

    it('не позволяет обновить токены после выхода', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/refresh')
        .send({ refreshToken })
        .expect(401);

      expect(response.body).toEqual(
        expect.objectContaining({
          statusCode: 401,
        }),
      );
    });
  });
});
