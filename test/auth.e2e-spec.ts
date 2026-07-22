import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import * as cookieParser from 'cookie-parser';
import type { Server } from 'http';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { AllExceptionsFilter } from './../src/common/filters/all-exceptions.filter';

interface AuthUserResponse {
  id: string;
  name: string;
  email: string;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUserResponse;
}

interface TokensResponse {
  accessToken: string;
  refreshToken: string;
}

interface ErrorResponse {
  statusCode: number;
  message: string | string[];
}

interface LogoutResponse {
  message: string;
}

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let httpServer: Server;

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

    httpServer = app.getHttpServer() as Server;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/auth/register', () => {
    it('регистрирует нового пользователя', async () => {
      const response = await request(httpServer)
        .post('/api/auth/register')
        .send(testUser)
        .expect(201);

      const body = response.body as AuthResponse;

      expect(typeof body.accessToken).toBe('string');
      expect(typeof body.refreshToken).toBe('string');
      expect(typeof body.user.id).toBe('string');
      expect(body.user.name).toBe(testUser.name);
      expect(body.user.email).toBe(testUser.email);

      accessToken = body.accessToken;
      refreshToken = body.refreshToken;
    });

    it('возвращает 409 при повторной регистрации того же email', async () => {
      const response = await request(httpServer)
        .post('/api/auth/register')
        .send(testUser)
        .expect(409);

      const body = response.body as ErrorResponse;

      expect(body).toEqual(
        expect.objectContaining({
          statusCode: 409,
          message: 'Пользователь с таким email уже существует',
        }),
      );
    });

    it('возвращает 400 при некорректном email', async () => {
      const response = await request(httpServer)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'incorrect-email',
          password: 'Test12345',
        })
        .expect(400);

      const body = response.body as ErrorResponse;

      expect(body).toEqual(
        expect.objectContaining({
          statusCode: 400,
        }),
      );

      expect(body.message).toEqual(
        expect.arrayContaining(['Некорректный email']),
      );
    });

    it('возвращает 400, если передано лишнее поле', async () => {
      const response = await request(httpServer)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: `extra-field-${Date.now()}@example.com`,
          password: 'Test12345',
          role: 'admin',
        })
        .expect(400);

      const body = response.body as ErrorResponse;

      expect(body).toEqual(
        expect.objectContaining({
          statusCode: 400,
        }),
      );
    });
  });

  describe('POST /api/auth/login', () => {
    it('авторизует зарегистрированного пользователя', async () => {
      const response = await request(httpServer)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(200);

      const body = response.body as AuthResponse;

      expect(typeof body.accessToken).toBe('string');
      expect(typeof body.refreshToken).toBe('string');
      expect(typeof body.user.id).toBe('string');
      expect(body.user.name).toBe(testUser.name);
      expect(body.user.email).toBe(testUser.email);

      // После входа refresh token в БД обновляется,
      // поэтому дальше используем именно новые токены.
      accessToken = body.accessToken;
      refreshToken = body.refreshToken;
    });

    it('возвращает 401 при неправильном пароле', async () => {
      const response = await request(httpServer)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'WrongPassword1',
        })
        .expect(401);

      const body = response.body as ErrorResponse;

      expect(body).toEqual(
        expect.objectContaining({
          statusCode: 401,
          message: 'Неверный email или пароль',
        }),
      );
    });

    it('возвращает 401 для несуществующего пользователя', async () => {
      const response = await request(httpServer)
        .post('/api/auth/login')
        .send({
          email: `unknown-${Date.now()}@example.com`,
          password: 'Test12345',
        })
        .expect(401);

      const body = response.body as ErrorResponse;

      expect(body).toEqual(
        expect.objectContaining({
          statusCode: 401,
          message: 'Неверный email или пароль',
        }),
      );
    });

    it('возвращает 400 при некорректных данных', async () => {
      const response = await request(httpServer)
        .post('/api/auth/login')
        .send({
          email: 'not-an-email',
          password: '123',
        })
        .expect(400);

      const body = response.body as ErrorResponse;

      expect(body).toEqual(
        expect.objectContaining({
          statusCode: 400,
        }),
      );

      expect(body.message).toEqual(
        expect.arrayContaining([
          'Некорректный email',
          'Пароль должен содержать минимум 6 символов',
        ]),
      );
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('обновляет access и refresh токены', async () => {
      const response = await request(httpServer)
        .post('/api/auth/refresh')
        .send({ refreshToken })
        .expect(200);

      const body = response.body as TokensResponse;

      expect(typeof body.accessToken).toBe('string');
      expect(typeof body.refreshToken).toBe('string');

      accessToken = body.accessToken;
      refreshToken = body.refreshToken;
    });

    it('возвращает 401 без refresh token', async () => {
      const response = await request(httpServer)
        .post('/api/auth/refresh')
        .send({})
        .expect(401);

      const body = response.body as ErrorResponse;

      expect(body).toEqual(
        expect.objectContaining({
          statusCode: 401,
        }),
      );
    });

    it('возвращает 401 с некорректным refresh token', async () => {
      const response = await request(httpServer)
        .post('/api/auth/refresh')
        .send({
          refreshToken: 'incorrect-refresh-token',
        })
        .expect(401);

      const body = response.body as ErrorResponse;

      expect(body).toEqual(
        expect.objectContaining({
          statusCode: 401,
        }),
      );
    });
  });

  describe('POST /api/auth/logout', () => {
    it('возвращает 401 без access token', async () => {
      const response = await request(httpServer)
        .post('/api/auth/logout')
        .expect(401);

      const body = response.body as ErrorResponse;

      expect(body).toEqual(
        expect.objectContaining({
          statusCode: 401,
        }),
      );
    });

    it('завершает сессию авторизованного пользователя', async () => {
      const response = await request(httpServer)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      const body = response.body as LogoutResponse;

      expect(body).toEqual({
        message: 'Вы успешно вышли из аккаунта',
      });
    });

    it('не позволяет обновить токены после выхода', async () => {
      const response = await request(httpServer)
        .post('/api/auth/refresh')
        .send({ refreshToken })
        .expect(401);

      const body = response.body as ErrorResponse;

      expect(body).toEqual(
        expect.objectContaining({
          statusCode: 401,
        }),
      );
    });
  });
});
