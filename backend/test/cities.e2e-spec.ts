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
import { DataSource, In, Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { AppModule } from './../src/app.module';
import { AllExceptionsFilter } from './../src/common/filters/all-exceptions.filter';
import { City } from './../src/cities/entities/city.entity';
import { User } from './../src/users/entities/user.entity';
import { UserRole } from './../src/users/user.enums';

interface AuthResponse {
  accessToken: string;
}

interface CityResponse {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface ErrorResponse {
  statusCode: number;
  message: string | string[];
}

describe('CitiesController (e2e)', () => {
  let app: INestApplication;
  let httpServer: Server;
  let cityRepository: Repository<City>;
  let userRepository: Repository<User>;

  let adminAccessToken: string;
  let userAccessToken: string;

  const runId = randomUUID();
  const cityNamePrefix = `E2E Cities ${runId}`;
  const adminData = {
    name: 'E2E Cities Admin',
    email: `e2e-cities-admin-${runId}@example.com`,
    password: 'Test12345',
  };
  const userData = {
    name: 'E2E Cities User',
    email: `e2e-cities-user-${runId}@example.com`,
    password: 'Test12345',
  };

  const createCity = async (name: string): Promise<City> =>
    cityRepository.save(cityRepository.create({ name }));

  const login = async (email: string, password: string): Promise<string> => {
    const response = await request(httpServer)
      .post('/api/auth/login')
      .send({ email, password })
      .expect(200);

    return (response.body as AuthResponse).accessToken;
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
    cityRepository = dataSource.getRepository(City);
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

    adminAccessToken = await login(adminData.email, adminData.password);
    userAccessToken = await login(userData.email, userData.password);
  });

  afterEach(async () => {
    await cityRepository
      .createQueryBuilder()
      .delete()
      .where('name LIKE :prefix', { prefix: `${cityNamePrefix}%` })
      .execute();
  });

  afterAll(async () => {
    await cityRepository
      .createQueryBuilder()
      .delete()
      .where('name LIKE :prefix', { prefix: `${cityNamePrefix}%` })
      .execute();
    await userRepository.delete({
      email: In([adminData.email, userData.email]),
    });
    await app.close();
  });

  describe('GET /api/cities', () => {
    it('returns cities sorted by name and limits the response to 10 items', async () => {
      await Promise.all(
        Array.from({ length: 12 }, (_, index) =>
          createCity(
            `${cityNamePrefix} Limit ${String(11 - index).padStart(2, '0')}`,
          ),
        ),
      );

      const response = await request(httpServer)
        .get('/api/cities')
        .query({ search: `${runId} Limit` })
        .expect(200);
      const body = response.body as CityResponse[];

      expect(body).toHaveLength(10);
      expect(body.map(({ name }) => name)).toEqual(
        [...body.map(({ name }) => name)].sort((a, b) => a.localeCompare(b)),
      );
    });

    it('filters case-insensitively and trims the search query', async () => {
      const matchingCity = await createCity(`${cityNamePrefix} Search Moscow`);
      await createCity(`${cityNamePrefix} Search Kazan`);

      const response = await request(httpServer)
        .get('/api/cities')
        .query({ search: '  mOsCoW  ' })
        .expect(200);
      const body = response.body as CityResponse[];

      expect(body.map(({ id }) => id)).toContain(matchingCity.id);
      expect(body.some(({ name }) => name.endsWith('Kazan'))).toBe(false);
    });

    it('rejects unknown query parameters', async () => {
      const response = await request(httpServer)
        .get('/api/cities')
        .query({ unknown: 'value' })
        .expect(400);

      expect((response.body as ErrorResponse).statusCode).toBe(400);
    });
  });

  describe('POST /api/cities', () => {
    it('allows an administrator to create a trimmed city name', async () => {
      const cityName = `${cityNamePrefix} Create`;
      const response = await request(httpServer)
        .post('/api/cities')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({ name: `  ${cityName}  ` })
        .expect(201);
      const body = response.body as CityResponse;

      expect(body).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: cityName,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      );
      await expect(cityRepository.findOneBy({ id: body.id })).resolves.toEqual(
        expect.objectContaining({ name: cityName }),
      );
    });

    it.each([
      ['without an access token', undefined, 401],
      ['for a regular user', 'user', 403],
    ])('rejects creation %s', async (_case, actor, statusCode) => {
      const apiRequest = request(httpServer).post('/api/cities');
      if (actor === 'user') {
        apiRequest.set('Authorization', `Bearer ${userAccessToken}`);
      }

      const response = await apiRequest
        .send({ name: `${cityNamePrefix} Forbidden ${statusCode}` })
        .expect(statusCode);

      expect((response.body as ErrorResponse).statusCode).toBe(statusCode);
    });

    it.each([
      ['an empty body', {}],
      ['a blank name', { name: '   ' }],
      ['a non-string name', { name: 123 }],
      ['an unknown field', { name: 'Valid', unknown: true }],
    ])('rejects %s', async (_case, payload) => {
      const response = await request(httpServer)
        .post('/api/cities')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(payload)
        .expect(400);

      expect((response.body as ErrorResponse).statusCode).toBe(400);
    });

    it('returns 409 when the city name already exists', async () => {
      const cityName = `${cityNamePrefix} Duplicate`;
      await createCity(cityName);

      const response = await request(httpServer)
        .post('/api/cities')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({ name: cityName })
        .expect(409);

      expect((response.body as ErrorResponse).statusCode).toBe(409);
    });
  });

  describe('PATCH /api/cities/:id', () => {
    it('allows an administrator to update a city', async () => {
      const city = await createCity(`${cityNamePrefix} Before Update`);
      const newName = `${cityNamePrefix} After Update`;

      const response = await request(httpServer)
        .patch(`/api/cities/${city.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({ name: newName })
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({ id: city.id, name: newName }),
      );
      await expect(cityRepository.findOneBy({ id: city.id })).resolves.toEqual(
        expect.objectContaining({ name: newName }),
      );
    });

    it.each([
      ['without an access token', undefined, 401],
      ['for a regular user', 'user', 403],
    ])('rejects update %s', async (_case, actor, statusCode) => {
      const city = await createCity(
        `${cityNamePrefix} Protected ${statusCode}`,
      );
      const apiRequest = request(httpServer).patch(`/api/cities/${city.id}`);
      if (actor === 'user') {
        apiRequest.set('Authorization', `Bearer ${userAccessToken}`);
      }

      await apiRequest
        .send({ name: `${cityNamePrefix} Must Not Change` })
        .expect(statusCode);
      await expect(cityRepository.findOneBy({ id: city.id })).resolves.toEqual(
        expect.objectContaining({ name: city.name }),
      );
    });

    it('returns 400 for an invalid city id', async () => {
      await request(httpServer)
        .patch('/api/cities/not-a-uuid')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({ name: `${cityNamePrefix} Invalid ID` })
        .expect(400);
    });

    it('returns 404 for a missing city', async () => {
      await request(httpServer)
        .patch(`/api/cities/${randomUUID()}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({ name: `${cityNamePrefix} Missing` })
        .expect(404);
    });

    it.each([{}, { name: '' }, { name: 123 }, { name: 'Valid', extra: true }])(
      'rejects the invalid payload %#',
      async (payload) => {
        const city = await createCity(`${cityNamePrefix} Invalid Payload`);

        await request(httpServer)
          .patch(`/api/cities/${city.id}`)
          .set('Authorization', `Bearer ${adminAccessToken}`)
          .send(payload)
          .expect(400);
      },
    );
  });

  describe('DELETE /api/cities/:id', () => {
    it('allows an administrator to delete a city and returns no content', async () => {
      const city = await createCity(`${cityNamePrefix} Delete`);

      const response = await request(httpServer)
        .delete(`/api/cities/${city.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(204);

      expect(response.body).toEqual({});
      await expect(
        cityRepository.findOneBy({ id: city.id }),
      ).resolves.toBeNull();
    });

    it.each([
      ['without an access token', undefined, 401],
      ['for a regular user', 'user', 403],
    ])('rejects deletion %s', async (_case, actor, statusCode) => {
      const city = await createCity(
        `${cityNamePrefix} Protected Delete ${statusCode}`,
      );
      const apiRequest = request(httpServer).delete(`/api/cities/${city.id}`);
      if (actor === 'user') {
        apiRequest.set('Authorization', `Bearer ${userAccessToken}`);
      }

      await apiRequest.expect(statusCode);
      await expect(
        cityRepository.findOneBy({ id: city.id }),
      ).resolves.not.toBeNull();
    });

    it('returns 400 for an invalid city id', async () => {
      await request(httpServer)
        .delete('/api/cities/not-a-uuid')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(400);
    });

    it('returns 404 for a missing city', async () => {
      await request(httpServer)
        .delete(`/api/cities/${randomUUID()}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(404);
    });
  });
});
