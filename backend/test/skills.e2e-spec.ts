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
import { Skill } from './../src/skills/entities/skill.entity';
import { Category } from './../src/categories/entities/category.entity';

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface SkillResponse {
  id: string;
  title: string;
  description?: string | null;
  images?: string[] | null;
  createdAt: string;
  updatedAt: string;
  owner: {
    id: string;
    name: string;
    email: string;
  };
  category?: {
    id: string;
    name: string;
  } | null;
}

interface SkillsListResponse {
  data: SkillResponse[];
  page: number;
  totalPages: number;
}

interface SimilarUserResponse {
  id: string;
  name: string;
  email: string;
  commonSkillsCount: number;
  skills: Array<{
    id: string;
    title: string;
    description?: string | null;
  }>;
}

interface ErrorResponse {
  statusCode: number;
  message?: string | string[];
}

describe('SkillsController (e2e)', () => {
  let app: INestApplication;
  let httpServer: Server;

  let userRepository: Repository<User>;
  let skillRepository: Repository<Skill>;
  let categoryRepository: Repository<Category>;

  let adminAccessToken: string;
  let userAccessToken: string;
  let userId: string;

  const testId = Date.now();

  const adminData = {
    name: 'E2E Skills Admin',
    email: `e2e-skills-admin-${testId}@example.com`,
    password: 'Test12345',
  };

  const userData = {
    name: 'E2E Skills User',
    email: `e2e-skills-user-${testId}@example.com`,
    password: 'Test12345',
  };

  let createdCategoryIds: string[] = [];
  let createdSkillIds: string[] = [];
  let userSkillIds: string[] = [];

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
    skillRepository = dataSource.getRepository(Skill);
    categoryRepository = dataSource.getRepository(Category);

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

  afterAll(async () => {
    for (const skillId of [...createdSkillIds].reverse()) {
      await skillRepository.delete(skillId);
    }
    createdSkillIds = [];
    userSkillIds = [];

    for (const categoryId of [...createdCategoryIds].reverse()) {
      await categoryRepository.delete(categoryId);
    }
    createdCategoryIds = [];

    await userRepository.delete({ email: adminData.email });
    await userRepository.delete({ email: userData.email });
    await app.close();
  });

  describe('POST /api/skills', () => {
    let category: Category;

    beforeAll(async () => {
      const response = await request(httpServer)
        .post('/api/categories')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          name: `E2E Category ${testId}`,
        })
        .expect(201);

      category = response.body;
      createdCategoryIds.push(category.id);
    });

    it('создает новый навык', async () => {
      const skillData = {
        title: 'Advanced TypeScript',
        description: 'Master TypeScript patterns and best practices',
        categoryId: category.id,
      };

      const response = await request(httpServer)
        .post('/api/skills')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send(skillData)
        .expect(201);

      const body = response.body as SkillResponse;

      expect(body).toHaveProperty('id');
      expect(body.title).toBe(skillData.title);
      expect(body.description).toBe(skillData.description);
      expect(body.owner.id).toBe(userId);
      expect(body.category?.id).toBe(category.id);
      expect(body).toHaveProperty('createdAt');
      expect(body).toHaveProperty('updatedAt');

      createdSkillIds.push(body.id);
      userSkillIds.push(body.id);
    });

    it('создает навык без категории', async () => {
      const skillData = {
        title: 'No Category Skill',
        description: 'This skill has no category',
      };

      const response = await request(httpServer)
        .post('/api/skills')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send(skillData)
        .expect(201);

      const body = response.body as SkillResponse;

      expect(body.title).toBe(skillData.title);
      expect(body.category).toBeUndefined();

      createdSkillIds.push(body.id);
      userSkillIds.push(body.id);
    });

    it('возвращает 401 без access token', async () => {
      const response = await request(httpServer)
        .post('/api/skills')
        .send({
          title: 'Unauthorized Skill',
        })
        .expect(401);

      const body = response.body as ErrorResponse;

      expect(body.statusCode).toBe(401);
    });

    it('возвращает 400 при отсутствии title', async () => {
      const response = await request(httpServer)
        .post('/api/skills')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send({
          description: 'Missing title',
        })
        .expect(400);

      const body = response.body as ErrorResponse;

      expect(body.statusCode).toBe(400);
      expect(body.message).toEqual(
        expect.arrayContaining(['title must be a string']),
      );
    });
  });

  describe('GET /api/skills', () => {
    beforeAll(async () => {
      const categoryRes = await request(httpServer)
        .post('/api/categories')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          name: `E2E Search Category ${testId}`,
        })
        .expect(201);

      const category = categoryRes.body;
      createdCategoryIds.push(category.id);

      const skills = [
        { title: 'React Development', description: 'Frontend framework' },
        { title: 'Node.js Backend', description: 'Server-side JavaScript' },
        { title: 'Python Programming', description: 'Data science' },
        { title: 'React Native', description: 'Mobile development' },
      ];

      for (const skill of skills) {
        const res = await request(httpServer)
          .post('/api/skills')
          .set('Authorization', `Bearer ${userAccessToken}`)
          .send({
            ...skill,
            categoryId: category.id,
          })
          .expect(201);

        createdSkillIds.push(res.body.id);
        userSkillIds.push(res.body.id);
      }
    });

    it('возвращает список навыков с пагинацией', async () => {
      const response = await request(httpServer)
        .get('/api/skills')
        .query({ page: 1, limit: 10 })
        .expect(200);

      const body = response.body as SkillsListResponse;

      expect(body).toHaveProperty('data');
      expect(body).toHaveProperty('page');
      expect(body).toHaveProperty('totalPages');
      expect(Array.isArray(body.data)).toBe(true);
      expect(body.page).toBe(1);
    });

    it('фильтрует навыки по поисковому запросу', async () => {
      const response = await request(httpServer)
        .get('/api/skills')
        .query({ search: 'React Development' })
        .expect(200);

      const body = response.body as SkillsListResponse;

      expect(body.data.length).toBeGreaterThan(0);
      expect(body.data[0].title).toMatch(/React Development/i);
    });

    it('фильтрует навыки по категории', async () => {
      const categories = await request(httpServer)
        .get('/api/categories')
        .expect(200);

      const categoryId = categories.body[0]?.id;

      const response = await request(httpServer)
        .get('/api/skills')
        .query({ category: categoryId })
        .expect(200);

      const body = response.body as SkillsListResponse;

      expect(body).toHaveProperty('data');
      expect(body).toHaveProperty('page');
      expect(body).toHaveProperty('totalPages');
    });

    it('возвращает пустой массив при поиске по несуществующей категории', async () => {
      const fakeCategoryId = '00000000-0000-0000-0000-000000000000';

      const response = await request(httpServer)
        .get('/api/skills')
        .query({ category: fakeCategoryId })
        .expect(200);

      const body = response.body as SkillsListResponse;

      expect(body).toHaveProperty('data');
      expect(body).toHaveProperty('totalPages');
    });

    it('возвращает 404 при запросе несуществующей страницы', async () => {
      const response = await request(httpServer)
        .get('/api/skills')
        .query({ page: 999, limit: 10 })
        .expect(404);

      const body = response.body as ErrorResponse;

      expect(body.statusCode).toBe(404);
      expect(body.message).toContain('Страница 999 не найдена');
    });
  });

  describe('GET /api/skills/:id', () => {
    let skillId: string;

    beforeAll(async () => {
      const response = await request(httpServer)
        .post('/api/skills')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send({
          title: `E2E Get Skill ${testId}`,
          description: 'Skill for getting by ID',
        })
        .expect(201);

      skillId = response.body.id;
      createdSkillIds.push(skillId);
      userSkillIds.push(skillId);
    });

    it('возвращает навык по ID', async () => {
      const response = await request(httpServer)
        .get(`/api/skills/${skillId}`)
        .expect(200);

      const body = response.body as SkillResponse;

      expect(body.id).toBe(skillId);
      expect(body.title).toBe(`E2E Get Skill ${testId}`);
      expect(body).toHaveProperty('owner');
      expect(body.owner.id).toBe(userId);
    });

    it('возвращает 404 для несуществующего навыка', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';

      const response = await request(httpServer)
        .get(`/api/skills/${fakeId}`)
        .expect(404);

      const body = response.body as ErrorResponse;

      expect(body.statusCode).toBe(404);
    });
  });

  describe('PATCH /api/skills/:id', () => {
    let skillId: string;

    beforeAll(async () => {
      const response = await request(httpServer)
        .post('/api/skills')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send({
          title: `E2E Update Skill ${testId}`,
          description: 'Original description',
        })
        .expect(201);

      skillId = response.body.id;
      createdSkillIds.push(skillId);
      userSkillIds.push(skillId);
    });

    it('обновляет навык', async () => {
      const updateData = {
        title: 'Updated Skill Title',
        description: 'Updated description',
      };

      const response = await request(httpServer)
        .patch(`/api/skills/${skillId}`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send(updateData)
        .expect(200);

      const body = response.body as SkillResponse;

      expect(body.title).toBe(updateData.title);
      expect(body.description).toBe(updateData.description);
    });

    it('возвращает 401 без access token', async () => {
      await request(httpServer)
        .patch(`/api/skills/${skillId}`)
        .send({ title: 'Hacked Title' })
        .expect(401);
    });

    it('возвращает 403 при попытке обновить чужой навык', async () => {
      const otherUserData = {
        name: 'Other E2E User',
        email: `other-${Date.now()}@example.com`,
        password: 'Test12345',
      };

      await request(httpServer)
        .post('/api/auth/register')
        .send(otherUserData)
        .expect(201);

      const loginResponse = await request(httpServer)
        .post('/api/auth/login')
        .send({
          email: otherUserData.email,
          password: otherUserData.password,
        })
        .expect(200);

      const otherAccessToken = (loginResponse.body as AuthResponse).accessToken;

      const response = await request(httpServer)
        .patch(`/api/skills/${skillId}`)
        .set('Authorization', `Bearer ${otherAccessToken}`)
        .send({ title: 'Stolen Skill' })
        .expect(403);

      const body = response.body as ErrorResponse;

      expect(body.statusCode).toBe(403);
      expect(body.message).toBe('Вы не можете редактировать чужой навык');

      await userRepository.delete({ email: otherUserData.email });
    });
  });

  describe('POST /api/skills/:id/favorite', () => {
    let skillId: string;

    beforeAll(async () => {
      const response = await request(httpServer)
        .post('/api/skills')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send({
          title: `E2E Favorite Skill ${testId}`,
        })
        .expect(201);

      skillId = response.body.id;
      createdSkillIds.push(skillId);
      userSkillIds.push(skillId);
    });

    it('добавляет навык в избранное', async () => {
      await request(httpServer)
        .post(`/api/skills/${skillId}/favorite`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .expect(201);

      const meResponse = await request(httpServer)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .expect(200);

      expect(Array.isArray(meResponse.body.favoriteSkills)).toBe(true);
      expect(
        meResponse.body.favoriteSkills.some(
          (skill: { id: string }) => skill.id === skillId,
        ),
      ).toBe(true);
    });

    it('возвращает 409 при повторном добавлении', async () => {
      const response = await request(httpServer)
        .post(`/api/skills/${skillId}/favorite`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .expect(409);

      const body = response.body as ErrorResponse;

      expect(body.statusCode).toBe(409);
      expect(body.message).toContain('Навык уже добавлен в избранное');
    });

    it('возвращает 401 без access token', async () => {
      await request(httpServer)
        .post(`/api/skills/${skillId}/favorite`)
        .expect(401);
    });

    it('возвращает 404 при добавлении несуществующего навыка', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';

      const response = await request(httpServer)
        .post(`/api/skills/${fakeId}/favorite`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .expect(404);

      const body = response.body as ErrorResponse;

      expect(body.statusCode).toBe(404);
      expect(body.message).toContain('Skill with ID');
    });
  });

  describe('DELETE /api/skills/:id/favorite', () => {
    let skillId: string;

    beforeAll(async () => {
      const response = await request(httpServer)
        .post('/api/skills')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send({
          title: `E2E Unfavorite Skill ${testId}`,
        })
        .expect(201);

      skillId = response.body.id;
      createdSkillIds.push(skillId);
      userSkillIds.push(skillId);

      await request(httpServer)
        .post(`/api/skills/${skillId}/favorite`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .expect(201);
    });

    it('удаляет навык из избранного', async () => {
      await request(httpServer)
        .delete(`/api/skills/${skillId}/favorite`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .expect(200);

      const meResponse = await request(httpServer)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .expect(200);

      expect(
        meResponse.body.favoriteSkills.some(
          (skill: { id: string }) => skill.id === skillId,
        ),
      ).toBe(false);
    });

    it('возвращает 404 при удалении не избранного навыка', async () => {
      const response = await request(httpServer)
        .delete(`/api/skills/${skillId}/favorite`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .expect(404);

      const body = response.body as ErrorResponse;

      expect(body.statusCode).toBe(404);
      expect(body.message).toContain('Навык не найден в избранном');
    });
  });

  describe('GET /api/skills/:id/similar', () => {
    let category: Category;
    let skillId: string;

    beforeAll(async () => {
      const categoryRes = await request(httpServer)
        .post('/api/categories')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          name: `E2E Similar Category ${testId}`,
        })
        .expect(201);

      category = categoryRes.body;
      createdCategoryIds.push(category.id);

      const skillRes = await request(httpServer)
        .post('/api/skills')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send({
          title: `E2E Main Skill ${testId}`,
          categoryId: category.id,
        })
        .expect(201);

      skillId = skillRes.body.id;
      createdSkillIds.push(skillId);
      userSkillIds.push(skillId);

      const otherUserData = {
        name: 'Similar User',
        email: `similar-${Date.now()}@example.com`,
        password: 'Test12345',
      };

      await request(httpServer)
        .post('/api/auth/register')
        .send(otherUserData)
        .expect(201);

      const loginRes = await request(httpServer)
        .post('/api/auth/login')
        .send({
          email: otherUserData.email,
          password: otherUserData.password,
        })
        .expect(200);

      const otherAccessToken = (loginRes.body as AuthResponse).accessToken;

      const otherSkillRes = await request(httpServer)
        .post('/api/skills')
        .set('Authorization', `Bearer ${otherAccessToken}`)
        .send({
          title: `E2E Similar Skill ${testId}`,
          categoryId: category.id,
        })
        .expect(201);

      createdSkillIds.push(otherSkillRes.body.id);

      await userRepository.delete({ email: otherUserData.email });
    });

    it('возвращает похожих пользователей', async () => {
      const response = await request(httpServer)
        .get(`/api/skills/${skillId}/similar`)
        .expect(200);

      const body = response.body as SimilarUserResponse[];

      expect(Array.isArray(body)).toBe(true);
    });

    it('возвращает пустой массив для навыка без категории', async () => {
      const skillRes = await request(httpServer)
        .post('/api/skills')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send({
          title: `E2E No Category Skill ${testId}`,
        })
        .expect(201);

      const noCategorySkillId = skillRes.body.id;
      createdSkillIds.push(noCategorySkillId);

      const response = await request(httpServer)
        .get(`/api/skills/${noCategorySkillId}/similar`)
        .expect(200);

      const body = response.body as SimilarUserResponse[];

      expect(Array.isArray(body)).toBe(true);
    });
  });

  describe('DELETE /api/skills/:id', () => {
    let skillId: string;

    beforeAll(async () => {
      const response = await request(httpServer)
        .post('/api/skills')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send({
          title: `E2E Delete Skill ${testId}`,
        })
        .expect(201);

      skillId = response.body.id;
      createdSkillIds.push(skillId);
      userSkillIds.push(skillId);
    });

    it('удаляет навык', async () => {
      await request(httpServer)
        .delete(`/api/skills/${skillId}`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .expect(200);

      const deletedSkill = await skillRepository.findOneBy({ id: skillId });
      expect(deletedSkill).toBeNull();

      createdSkillIds = createdSkillIds.filter((id) => id !== skillId);
    });

    it('возвращает 401 без access token', async () => {
      const response = await request(httpServer)
        .delete(`/api/skills/${skillId}`)
        .expect(401);

      const body = response.body as ErrorResponse;

      expect(body.statusCode).toBe(401);
    });

    it('возвращает 403 при попытке удалить чужой навык', async () => {
      const otherUserData = {
        name: 'Other User',
        email: `other-delete-${Date.now()}@example.com`,
        password: 'Test12345',
      };

      await request(httpServer)
        .post('/api/auth/register')
        .send(otherUserData)
        .expect(201);

      const loginRes = await request(httpServer)
        .post('/api/auth/login')
        .send({
          email: otherUserData.email,
          password: otherUserData.password,
        })
        .expect(200);

      const otherAccessToken = (loginRes.body as AuthResponse).accessToken;

      const skillRes = await request(httpServer)
        .post('/api/skills')
        .set('Authorization', `Bearer ${otherAccessToken}`)
        .send({
          title: `E2E Other Skill ${testId}`,
        })
        .expect(201);

      const otherSkillId = skillRes.body.id;
      createdSkillIds.push(otherSkillId);

      const response = await request(httpServer)
        .delete(`/api/skills/${otherSkillId}`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .expect(403);

      const body = response.body as ErrorResponse;

      expect(body.statusCode).toBe(403);
      expect(body.message).toBe('Вы не можете удалить чужой навык');

      await userRepository.delete({ email: otherUserData.email });
    });
  });
});
