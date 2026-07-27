import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import cookieParser from 'cookie-parser';
import type { Server } from 'http';
import request from 'supertest';
import { DataSource, Repository } from 'typeorm';
import { AppModule } from './../src/app.module';
import { AllExceptionsFilter } from './../src/common/filters/all-exceptions.filter';
import { User } from './../src/users/entities/user.entity';
import { UserRole } from './../src/users/user.enums';

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface UserResponse {
  id: string;
  name: string;
  email: string;
  about?: string | null;
  birthdate?: string | null;
  city?: string | null;
  avatar?: string | null;
  role?: UserRole;
}

interface ErrorResponse {
  statusCode: number;
  message?: string | string[];
}

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let httpServer: Server;

  let userRepository: Repository<User>;

  let adminAccessToken: string;
  let userAccessToken: string;
  let userId: string;

  const testId = Date.now();

  const adminData = {
    name: 'E2E Users Admin',
    email: `e2e-users-admin-${testId}@example.com`,
    password: 'Test12345',
  };

  const userData = {
    name: 'E2E Users Test User',
    email: `e2e-users-user-${testId}@example.com`,
    password: 'Test12345',
  };

  let createdUserIds: string[] = [];

  const rememberUser = (user: User): User => {
    createdUserIds.push(user.id);
    return user;
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

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

    const dataSource = app.get(DataSource);
    userRepository = dataSource.getRepository(User);

    await request(httpServer)
      .post('/api/auth/register')
      .send(adminData)
      .expect(201);

    await request(httpServer)
      .post('/api/auth/register')
      .send(userData)
      .expect(201);

    await userRepository.update(
      { email: adminData.email },
      { role: UserRole.ADMIN },
    );

    const adminLoginResponse = await request(httpServer)
      .post('/api/auth/login')
      .send({
        email: adminData.email,
        password: adminData.password,
      })
      .expect(200);

    const adminLoginBody = adminLoginResponse.body as AuthResponse;
    adminAccessToken = adminLoginBody.accessToken;

    const userLoginResponse = await request(httpServer)
      .post('/api/auth/login')
      .send({
        email: userData.email,
        password: userData.password,
      })
      .expect(200);

    const userLoginBody = userLoginResponse.body as AuthResponse;
    userAccessToken = userLoginBody.accessToken;
    userId = userLoginBody.user.id;
  });

  afterEach(async () => {
    for (const userId of [...createdUserIds].reverse()) {
      const admin = await userRepository.findOneBy({ email: adminData.email });
      const user = await userRepository.findOneBy({ email: userData.email });

      if (userId !== admin?.id && userId !== user?.id) {
        await userRepository.delete(userId);
      }
    }
    createdUserIds = [];
  });

  afterAll(async () => {
    await userRepository.delete({ email: adminData.email });
    await userRepository.delete({ email: userData.email });
    await app.close();
  });

  describe('POST /api/users', () => {
    it('создает нового пользователя', async () => {
      const newUserData = {
        name: 'New E2E User',
        email: `new-user-${Date.now()}@example.com`,
        password: 'Test12345',
      };

      const response = await request(httpServer)
        .post('/api/users')
        .send(newUserData)
        .expect(201);

      const body = response.body as UserResponse;

      expect(body).toHaveProperty('id');
      expect(body.email).toBe(newUserData.email);
      expect(body.name).toBe(newUserData.name);
      expect(body).not.toHaveProperty('password');
      expect(body).not.toHaveProperty('refreshToken');

      createdUserIds.push(body.id);
    });

    it('возвращает 409 при создании пользователя с существующим email', async () => {
      const response = await request(httpServer)
        .post('/api/users')
        .send({
          name: 'Duplicate User',
          email: userData.email,
          password: 'Test12345',
        })
        .expect(409);

      const body = response.body as ErrorResponse;

      expect(body.statusCode).toBe(409);
      expect(body.message).toContain('уже существует');
    });

    it('возвращает 400 при некорректных данных', async () => {
      const response = await request(httpServer)
        .post('/api/users')
        .send({
          email: 'not-an-email',
          password: '123',
        })
        .expect(400);

      const body = response.body as ErrorResponse;

      expect(body.statusCode).toBe(400);
      expect(body.message).toEqual(
        expect.arrayContaining([
          'email must be an email',
          'name must be longer than or equal to 2 characters',
        ]),
      );
    });
  });

  describe('GET /api/users', () => {
    it('возвращает массив пользователей', async () => {
      const response = await request(httpServer).get('/api/users').expect(200);

      const body = response.body as UserResponse[];

      expect(Array.isArray(body)).toBe(true);
      expect(body.length).toBeGreaterThan(0);
      expect(body[0]).toHaveProperty('id');
      expect(body[0]).toHaveProperty('name');
      expect(body[0]).toHaveProperty('email');
      expect(body[0]).not.toHaveProperty('password');
    });
  });

  describe('GET /api/users/me', () => {
    it('возвращает профиль текущего пользователя', async () => {
      const response = await request(httpServer)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .expect(200);

      const body = response.body as UserResponse;

      expect(body.id).toBe(userId);
      expect(body.email).toBe(userData.email);
      expect(body.name).toBe(userData.name);
      expect(body).not.toHaveProperty('password');
      expect(body).not.toHaveProperty('refreshToken');
    });

    it('возвращает 401 без access token', async () => {
      const response = await request(httpServer)
        .get('/api/users/me')
        .expect(401);

      const body = response.body as ErrorResponse;

      expect(body.statusCode).toBe(401);
    });

    it('возвращает 401 с невалидным токеном', async () => {
      const response = await request(httpServer)
        .get('/api/users/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      const body = response.body as ErrorResponse;

      expect(body.statusCode).toBe(401);
    });
  });

  describe('PATCH /api/users/me', () => {
    it('обновляет профиль текущего пользователя', async () => {
      const updateData = {
        name: 'Updated E2E Name',
        about: 'This is my updated bio for E2E testing',
        city: 'Moscow',
        birthdate: '1990-01-01',
      };

      const response = await request(httpServer)
        .patch('/api/users/me')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send(updateData)
        .expect(200);

      const body = response.body as UserResponse;

      expect(body.name).toBe(updateData.name);
      expect(body.about).toBe(updateData.about);
      expect(body.city).toBe(updateData.city);
      expect(body.birthdate).toBe(updateData.birthdate);
    });

    it('возвращает 401 без access token', async () => {
      const response = await request(httpServer)
        .patch('/api/users/me')
        .send({ name: 'Hacked Name' })
        .expect(401);

      const body = response.body as ErrorResponse;

      expect(body.statusCode).toBe(401);
    });
  });

  describe('PATCH /api/users/me/password', () => {
    it('меняет пароль пользователя', async () => {
      const response = await request(httpServer)
        .patch('/api/users/me/password')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send({
          oldPassword: userData.password,
          newPassword: 'NewPassword123',
        })
        .expect(200);

      const body = response.body as { message: string };

      expect(body.message).toBe('Пароль успешно изменён');

      await request(httpServer)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: 'NewPassword123',
        })
        .expect(200);
    });

    it('возвращает 401 при неверном старом пароле', async () => {
      const response = await request(httpServer)
        .patch('/api/users/me/password')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send({
          oldPassword: 'WrongPassword',
          newPassword: 'NewPassword123',
        })
        .expect(401);

      const body = response.body as ErrorResponse;

      expect(body.statusCode).toBe(401);
      expect(body.message).toBe('Неверный текущий пароль');
    });

    it('возвращает 401 без access token', async () => {
      const response = await request(httpServer)
        .patch('/api/users/me/password')
        .send({
          oldPassword: 'Test12345',
          newPassword: 'NewPassword123',
        })
        .expect(401);

      const body = response.body as ErrorResponse;

      expect(body.statusCode).toBe(401);
    });
  });

  describe('GET /api/users/:id', () => {
    it('возвращает пользователя по ID', async () => {
      const response = await request(httpServer)
        .get(`/api/users/${userId}`)
        .expect(200);

      const body = response.body as UserResponse;

      expect(body.id).toBe(userId);
      expect(body.email).toBe(userData.email);
      expect(body.name).toBe(userData.name);
      expect(body).not.toHaveProperty('password');
      expect(body).not.toHaveProperty('refreshToken');
    });

    it('возвращает 404 для несуществующего пользователя', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';

      const response = await request(httpServer)
        .get(`/api/users/${fakeId}`)
        .expect(404);

      const body = response.body as ErrorResponse;

      expect(body.statusCode).toBe(404);
      expect(body.message).toContain('User with ID');
      expect(body.message).toContain('not found');
    });
  });

  describe('PATCH /api/users/:id', () => {
    it('позволяет админу обновить пользователя', async () => {
      const response = await request(httpServer)
        .patch(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          name: 'Updated By Admin',
          city: 'Saint Petersburg',
        })
        .expect(200);

      const body = response.body as UserResponse;

      expect(body.name).toBe('Updated By Admin');
      expect(body.city).toBe('Saint Petersburg');
    });

    it('возвращает 401 без access token', async () => {
      await request(httpServer)
        .patch(`/api/users/${userId}`)
        .send({ name: 'Hacked Name' })
        .expect(401);
    });
  });

  describe('DELETE /api/users/:id', () => {
    let userToDeleteId: string;

    beforeAll(async () => {
      const response = await request(httpServer)
        .post('/api/users')
        .send({
          name: 'User To Delete',
          email: `delete-${Date.now()}@example.com`,
          password: 'Test12345',
        });

      userToDeleteId = response.body.id;
      createdUserIds.push(userToDeleteId);
    });

    it('позволяет админу удалить пользователя', async () => {
      await request(httpServer)
        .delete(`/api/users/${userToDeleteId}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(200);

      const deletedUser = await userRepository.findOneBy({
        id: userToDeleteId,
      });

      expect(deletedUser).toBeNull();

      createdUserIds = createdUserIds.filter((id) => id !== userToDeleteId);
    });

    it('возвращает 401 без access token', async () => {
      const response = await request(httpServer)
        .delete(`/api/users/${userToDeleteId}`)
        .expect(401);

      const body = response.body as ErrorResponse;

      expect(body.statusCode).toBe(401);
    });

    it('возвращает 404 при удалении несуществующего пользователя', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';

      const response = await request(httpServer)
        .delete(`/api/users/${fakeId}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(404);

      const body = response.body as ErrorResponse;

      expect(body.statusCode).toBe(404);
    });
  });
});
