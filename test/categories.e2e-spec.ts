import { ClassSerializerInterceptor, INestApplication, ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import * as cookieParser from 'cookie-parser';
import * as request from 'supertest';
import { DataSource, Repository } from 'typeorm';
import { AppModule } from './../src/app.module';
import { AllExceptionsFilter } from './../src/common/filters/all-exceptions.filter';
import { Category } from './../src/categories/entities/category.entity';
import { User } from './../src/users/entities/user.entity';
import { UserRole } from './../src/users/user.enums';

describe('CategoriesController (e2e)', () => {
  let app: INestApplication;

  let categoryRepository: Repository<Category>;
  let userRepository: Repository<User>;

  let adminAccessToken: string;
  let userAccessToken: string;

  const testId = Date.now();

  const adminData = {
    name: 'E2E Categories Admin',
    email: `e2e-categories-admin-${testId}@example.com`,
    password: 'Test12345',
  };

  const userData = {
    name: 'E2E Categories User',
    email: `e2e-categories-user-${testId}@example.com`,
    password: 'Test12345',
  };

  /*
   * Храним ID категорий, созданных в каждом тесте, чтобы не удалять чужие данные из базы.
   */
  let createdCategoryIds: string[] = [];

  const rememberCategory = (category: Category): Category => {
    createdCategoryIds.push(category.id);
    return category;
  };

  const createCategory = async (
    name: string,
    parent?: Category,
  ): Promise<Category> => {
    const category = categoryRepository.create({
      name,
      parent,
    });

    const savedCategory = await categoryRepository.save(category);

    return rememberCategory(savedCategory);
  };

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

    const dataSource = app.get(DataSource);

    categoryRepository = dataSource.getRepository(Category);
    userRepository = dataSource.getRepository(User);

    /*
     * Регистрируем двух пользователей через настоящее API.
     */
    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send(adminData)
      .expect(201);

    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send(userData)
      .expect(201);

    /*
     * Назначаем первому пользователю роль администратора. Это только подготовка тестовых данных.
     */
    await userRepository.update(
      {
        email: adminData.email,
      },
      {
        role: UserRole.ADMIN,
      },
    );

    /*
     * Выполняем login после изменения роли, чтобы получить токен администратора.
     */
    const adminLoginResponse = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: adminData.email,
        password: adminData.password,
      })
      .expect(200);

    adminAccessToken = adminLoginResponse.body.accessToken;

    const userLoginResponse = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: userData.email,
        password: userData.password,
      })
      .expect(200);

    userAccessToken = userLoginResponse.body.accessToken;
  });

  afterEach(async () => {
    /*
     * Удаляем категории в обратном порядке, сначала дочерние, затем родительские.
     */
    for (const categoryId of [...createdCategoryIds].reverse()) {
      await categoryRepository.delete(categoryId);
    }

    createdCategoryIds = [];
  });

  afterAll(async () => {
    /*
     * Дополнительная очистка на случай, если тест завершился до выполнения обычного afterEach.
     */
    for (const categoryId of [...createdCategoryIds].reverse()) {
      await categoryRepository.delete(categoryId);
    }

    await userRepository.delete({
      email: adminData.email,
    });

    await userRepository.delete({
      email: userData.email,
    });

    await app.close();
  });

  describe('GET /api/categories', () => {
    it('возвращает массив категорий', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/categories')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('возвращает созданные корневые категории', async () => {
      const programming = await createCategory(
        `E2E Programming ${testId}`,
      );

      const design = await createCategory(`E2E Design ${testId}`);

      const response = await request(app.getHttpServer())
        .get('/api/categories')
        .expect(200);

      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: programming.id,
            name: programming.name,
          }),
          expect.objectContaining({
            id: design.id,
            name: design.name,
          }),
        ]),
      );
    });

    it('возвращает дочернюю категорию внутри родительской', async () => {
      const parent = await createCategory(
        `E2E Development ${testId}`,
      );

      const child = await createCategory(
        `E2E Backend ${testId}`,
        parent,
      );

      const response = await request(app.getHttpServer())
        .get('/api/categories')
        .expect(200);

      const returnedParent = response.body.find(
        (category: Category) => category.id === parent.id,
      );

      expect(returnedParent).toBeDefined();

      expect(returnedParent.children).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: child.id,
            name: child.name,
          }),
        ]),
      );
    });
  });

  describe('GET /api/categories/:id', () => {
    it('возвращает категорию по ID', async () => {
      const category = await createCategory(
        `E2E Testing ${testId}`,
      );

      const response = await request(app.getHttpServer())
        .get(`/api/categories/${category.id}`)
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          id: category.id,
          name: category.name,
          children: expect.any(Array),
        }),
      );
    });

    it('возвращает null для несуществующей категории', async () => {
      const missingCategoryId =
        '11111111-1111-4111-8111-111111111111';

      const response = await request(app.getHttpServer())
        .get(`/api/categories/${missingCategoryId}`)
        .expect(200);

      expect(response.body).toEqual({});
    });
  });

  describe('POST /api/categories', () => {
    it('возвращает 401 без access token', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/categories')
        .send({
          name: `E2E Unauthorized ${testId}`,
        })
        .expect(401);

      expect(response.body).toEqual(
        expect.objectContaining({
          statusCode: 401,
        }),
      );
    });

    it('возвращает 403 для обычного пользователя', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/categories')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send({
          name: `E2E User category ${testId}`,
        })
        .expect(403);

      expect(response.body).toEqual(
        expect.objectContaining({
          statusCode: 403,
        }),
      );
    });

    it('позволяет администратору создать категорию', async () => {
      const categoryName = `E2E Admin category ${testId}`;

      const response = await request(app.getHttpServer())
        .post('/api/categories')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          name: categoryName,
        })
        .expect(201);

      createdCategoryIds.push(response.body.id);

      expect(response.body).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: categoryName,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      );

      const savedCategory = await categoryRepository.findOneBy({
        id: response.body.id,
      });

      expect(savedCategory).not.toBeNull();
      expect(savedCategory?.name).toBe(categoryName);
    });

    it('позволяет администратору создать дочернюю категорию', async () => {
      const parent = await createCategory(
        `E2E Parent ${testId}`,
      );

      const response = await request(app.getHttpServer())
        .post('/api/categories')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          name: `E2E Child ${testId}`,
          parentId: parent.id,
        })
        .expect(201);

      createdCategoryIds.push(response.body.id);

      const savedCategory = await categoryRepository.findOne({
        where: {
          id: response.body.id,
        },
        relations: {
          parent: true,
        },
      });

      expect(savedCategory).not.toBeNull();
      expect(savedCategory?.parent?.id).toBe(parent.id);
    });

    it('возвращает 400, если name отсутствует', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/categories')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({})
        .expect(400);

      expect(response.body).toEqual(
        expect.objectContaining({
          statusCode: 400,
        }),
      );
    });

    it('возвращает 400 при некорректном parentId', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/categories')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          name: `E2E Invalid parent ${testId}`,
          parentId: 'not-a-uuid',
        })
        .expect(400);

      expect(response.body).toEqual(
        expect.objectContaining({
          statusCode: 400,
        }),
      );
    });

    it('возвращает 400 при передаче лишнего поля', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/categories')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          name: `E2E Extra field ${testId}`,
          unknownField: 'unexpected value',
        })
        .expect(400);

      expect(response.body).toEqual(
        expect.objectContaining({
          statusCode: 400,
        }),
      );
    });
  });

  describe('PATCH /api/categories/:id', () => {
    it('позволяет администратору изменить категорию', async () => {
      const category = await createCategory(
        `E2E Old name ${testId}`,
      );

      const newName = `E2E New name ${testId}`;

      const response = await request(app.getHttpServer())
        .patch(`/api/categories/${category.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          name: newName,
        })
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          id: category.id,
          name: newName,
        }),
      );

      const updatedCategory = await categoryRepository.findOneBy({
        id: category.id,
      });

      expect(updatedCategory?.name).toBe(newName);
    });

    it('возвращает 401 без access token', async () => {
      const category = await createCategory(
        `E2E Unauthorized update ${testId}`,
      );

      await request(app.getHttpServer())
        .patch(`/api/categories/${category.id}`)
        .send({
          name: `E2E Forbidden update ${testId}`,
        })
        .expect(401);

      const unchangedCategory = await categoryRepository.findOneBy({
        id: category.id,
      });

      expect(unchangedCategory?.name).toBe(category.name);
    });

    it('возвращает 403 для обычного пользователя', async () => {
      const category = await createCategory(
        `E2E Protected update ${testId}`,
      );

      await request(app.getHttpServer())
        .patch(`/api/categories/${category.id}`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send({
          name: `E2E Forbidden update ${testId}`,
        })
        .expect(403);

      const unchangedCategory = await categoryRepository.findOneBy({
        id: category.id,
      });

      expect(unchangedCategory?.name).toBe(category.name);
    });
  });

  describe('DELETE /api/categories/:id', () => {
    it('позволяет администратору удалить категорию', async () => {
      const category = await createCategory(
        `E2E Delete me ${testId}`,
      );

      await request(app.getHttpServer())
        .delete(`/api/categories/${category.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(200);

      createdCategoryIds = createdCategoryIds.filter(
        (id) => id !== category.id,
      );

      const deletedCategory = await categoryRepository.findOneBy({
        id: category.id,
      });

      expect(deletedCategory).toBeNull();
    });

    it('возвращает 401 без access token', async () => {
      const category = await createCategory(
        `E2E Unauthorized delete ${testId}`,
      );

      await request(app.getHttpServer())
        .delete(`/api/categories/${category.id}`)
        .expect(401);

      const existingCategory = await categoryRepository.findOneBy({
        id: category.id,
      });

      expect(existingCategory).not.toBeNull();
    });

    it('возвращает 403 для обычного пользователя', async () => {
      const category = await createCategory(
        `E2E Protected delete ${testId}`,
      );

      await request(app.getHttpServer())
        .delete(`/api/categories/${category.id}`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .expect(403);

      const existingCategory = await categoryRepository.findOneBy({
        id: category.id,
      });

      expect(existingCategory).not.toBeNull();
    });
  });
});
