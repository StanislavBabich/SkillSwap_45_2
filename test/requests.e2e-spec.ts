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
import { DataSource, Repository } from 'typeorm';
import { AppModule } from './../src/app.module';
import { AllExceptionsFilter } from './../src/common/filters/all-exceptions.filter';
import { Request as RequestEntity } from './../src/requests/entities/request.entity';
import { RequestStatus } from './../src/requests/request-status.enums';
import { Skill } from './../src/skills/entities/skill.entity';
import { User } from './../src/users/entities/user.entity';
import { UserRole } from './../src/users/user.enums';

interface CreateRequestTestDto {
  receiverId: string;
  offeredSkillId: string;
  requestedSkillId: string;
}

interface RegisterUserData {
  name: string;
  email: string;
  password: string;
}

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

interface SkillResponse {
  id: string;
  title: string;
  description?: string | null;
}

interface UserPreviewResponse {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
}

interface RequestResponse {
  id: string;
  createdAt: string;
  status: RequestStatus;
  isRead: boolean;
  sender: UserPreviewResponse;
  receiver: UserPreviewResponse;
  offeredSkill: SkillResponse;
  requestedSkill: SkillResponse;
}

interface ErrorResponse {
  statusCode: number;
  message?: string | string[];
}

describe('RequestsController (e2e)', () => {
  let app: INestApplication;
  let httpServer: Server;
  let dataSource: DataSource;

  let requestRepository: Repository<RequestEntity>;
  let skillRepository: Repository<Skill>;
  let userRepository: Repository<User>;

  let senderAccessToken: string;
  let receiverAccessToken: string;
  let outsiderAccessToken: string;
  let adminAccessToken: string;

  let senderId: string;
  let receiverId: string;
  let outsiderId: string;
  let adminId: string;

  let offeredSkill: SkillResponse;
  let requestedSkill: SkillResponse;

  const testId = Date.now();

  const senderData = {
    name: 'E2E Requests Sender',
    email: `e2e-requests-sender-${testId}@example.com`,
    password: 'Test12345',
  };

  const receiverData = {
    name: 'E2E Requests Receiver',
    email: `e2e-requests-receiver-${testId}@example.com`,
    password: 'Test12345',
  };

  const outsiderData = {
    name: 'E2E Requests Outsider',
    email: `e2e-requests-outsider-${testId}@example.com`,
    password: 'Test12345',
  };

  const adminData = {
    name: 'E2E Requests Admin',
    email: `e2e-requests-admin-${testId}@example.com`,
    password: 'Test12345',
  };

  // Храним ID заявок, созданных в тестах, чтобы очищать только свои данные.
  let createdRequestIds: string[] = [];

  const createRequestDto = (
    receiverId: string,
    offeredSkillId: string,
    requestedSkillId: string,
  ): CreateRequestTestDto => ({
    receiverId,
    offeredSkillId,
    requestedSkillId,
  });

  const rememberRequest = (
    createdRequest: RequestResponse,
  ): RequestResponse => {
    createdRequestIds.push(createdRequest.id);

    return createdRequest;
  };

  const registerUser = async (
    userData: RegisterUserData,
  ): Promise<AuthResponse> => {
    const response = await request(httpServer)
      .post('/api/auth/register')
      .send(userData)
      .expect(201);

    return response.body as AuthResponse;
  };

  const loginUser = async (
    email: string,
    password: string,
  ): Promise<AuthResponse> => {
    const response = await request(httpServer)
      .post('/api/auth/login')
      .send({
        email,
        password,
      })
      .expect(200);

    return response.body as AuthResponse;
  };

  const createSkill = async (
    accessToken: string,
    title: string,
    description: string,
  ): Promise<SkillResponse> => {
    const response = await request(httpServer)
      .post('/api/skills')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title,
        description,
      })
      .expect(201);

    return response.body as SkillResponse;
  };

  const createRequest = async (
    accessToken = senderAccessToken,
  ): Promise<RequestResponse> => {
    const response = await request(httpServer)
      .post('/api/requests')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(createRequestDto(receiverId, offeredSkill.id, requestedSkill.id))
      .expect(201);

    return rememberRequest(response.body as RequestResponse);
  };

  const clearFavoriteSkills = async (): Promise<void> => {
    if (!senderId || !receiverId) {
      return;
    }

    await dataSource.query(
      `
        DELETE FROM "users_favorite_skills"
        WHERE "user_id" IN ($1, $2)
      `,
      [senderId, receiverId],
    );
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Повторяем глобальные настройки из src/main.ts.
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

    dataSource = app.get(DataSource);

    requestRepository = dataSource.getRepository(RequestEntity);
    skillRepository = dataSource.getRepository(Skill);
    userRepository = dataSource.getRepository(User);

    // Создаем пользователей через настоящий API.
    const senderAuth = await registerUser(senderData);
    const receiverAuth = await registerUser(receiverData);
    const outsiderAuth = await registerUser(outsiderData);
    const adminAuth = await registerUser(adminData);

    senderId = senderAuth.user.id;
    receiverId = receiverAuth.user.id;
    outsiderId = outsiderAuth.user.id;
    adminId = adminAuth.user.id;

    senderAccessToken = senderAuth.accessToken;
    receiverAccessToken = receiverAuth.accessToken;
    outsiderAccessToken = outsiderAuth.accessToken;

    // Назначаем роль администратора напрямую в БД.
    await userRepository.update(
      {
        id: adminId,
      },
      {
        role: UserRole.ADMIN,
      },
    );

    // После изменения роли выполняем login заново, чтобы новая роль попала в access-токен.
    const adminLogin = await loginUser(adminData.email, adminData.password);

    adminAccessToken = adminLogin.accessToken;

    // Создаем навык отправителя и навык получателя.
    offeredSkill = await createSkill(
      senderAccessToken,
      `E2E Offered Skill ${testId}`,
      'Навык, который предлагает отправитель',
    );

    requestedSkill = await createSkill(
      receiverAccessToken,
      `E2E Requested Skill ${testId}`,
      'Навык, который хочет получить отправитель',
    );
  });

  afterEach(async () => {
    // Сначала удаляем заявки, тк они ссылаются на пользователей и навыки.
    if (createdRequestIds.length > 0) {
      await requestRepository.delete(createdRequestIds);
    }

    createdRequestIds = [];

    // После принятия заявки навыки добавляются в избранное. Очищаем связующую таблицу после каждого теста.
    await clearFavoriteSkills();
  });

  afterAll(async () => {
    // Дополнительная очистка на случай, если тест завершился до выполнения afterEach.
    if (createdRequestIds.length > 0) {
      await requestRepository.delete(createdRequestIds);
    }

    await clearFavoriteSkills();

    if (offeredSkill?.id) {
      await skillRepository.delete(offeredSkill.id);
    }

    if (requestedSkill?.id) {
      await skillRepository.delete(requestedSkill.id);
    }

    await userRepository.delete([senderId, receiverId, outsiderId, adminId]);

    await app.close();
  });

  describe('Authorization', () => {
    it('возвращает 401 при создании заявки без access-токена', async () => {
      const response = await request(httpServer)
        .post('/api/requests')
        .send(createRequestDto(receiverId, offeredSkill.id, requestedSkill.id))
        .expect(401);

      const body = response.body as ErrorResponse;
      expect(body.statusCode).toBe(401);
    });

    it('возвращает 401 при получении входящих заявок без access-токена', async () => {
      const response = await request(httpServer)
        .get('/api/requests/incoming')
        .expect(401);

      const body = response.body as ErrorResponse;
      expect(body.statusCode).toBe(401);
    });
  });

  describe('POST /api/requests', () => {
    it('создаёт заявку на обмен навыками', async () => {
      const response = await request(httpServer)
        .post('/api/requests')
        .set('Authorization', `Bearer ${senderAccessToken}`)
        .send(createRequestDto(receiverId, offeredSkill.id, requestedSkill.id))
        .expect(201);

      const body = rememberRequest(response.body as RequestResponse);

      expect(body).toEqual(
        expect.objectContaining({
          id: expect.any(String) as string,
          createdAt: expect.any(String) as string,
          status: RequestStatus.PENDING,
          isRead: false,
        }),
      );

      expect(body.sender).toEqual(
        expect.objectContaining({
          id: senderId,
          name: senderData.name,
          email: senderData.email,
        }),
      );

      expect(body.receiver).toEqual(
        expect.objectContaining({
          id: receiverId,
          name: receiverData.name,
          email: receiverData.email,
        }),
      );

      expect(body.offeredSkill).toEqual(
        expect.objectContaining({
          id: offeredSkill.id,
          title: offeredSkill.title,
        }),
      );

      expect(body.requestedSkill).toEqual(
        expect.objectContaining({
          id: requestedSkill.id,
          title: requestedSkill.title,
        }),
      );

      const savedRequest = await requestRepository.findOne({
        where: {
          id: body.id,
        },
      });

      expect(savedRequest).not.toBeNull();
      expect(savedRequest?.status).toBe(RequestStatus.PENDING);
      expect(savedRequest?.isRead).toBe(false);
    });

    it('возвращает 400 при попытке отправить заявку самому себе', async () => {
      const response = await request(httpServer)
        .post('/api/requests')
        .set('Authorization', `Bearer ${senderAccessToken}`)
        .send(createRequestDto(senderId, offeredSkill.id, requestedSkill.id))
        .expect(400);

      const body = response.body as ErrorResponse;

      expect(body).toEqual(
        expect.objectContaining({
          statusCode: 400,
          message: 'Нельзя отправить заявку самому себе',
        }),
      );
    });

    it('возвращает 400 при некорректном теле запроса', async () => {
      const response = await request(httpServer)
        .post('/api/requests')
        .set('Authorization', `Bearer ${senderAccessToken}`)
        .send({
          receiverId: 'not-a-uuid',
          offeredSkillId: offeredSkill.id,
        })
        .expect(400);

      const body = response.body as ErrorResponse;

      expect(body.statusCode).toBe(400);
      expect(Array.isArray(body.message)).toBe(true);
    });
  });

  describe('GET /api/requests/incoming', () => {
    it('возвращает заявку во входящих у получателя', async () => {
      const createdRequest = await createRequest();

      const response = await request(httpServer)
        .get('/api/requests/incoming')
        .set('Authorization', `Bearer ${receiverAccessToken}`)
        .expect(200);

      const body = response.body as RequestResponse[];

      const incomingRequest = body.find(
        (item) => item.id === createdRequest.id,
      );

      expect(incomingRequest).toBeDefined();
      expect(incomingRequest?.receiver.id).toBe(receiverId);
      expect(incomingRequest?.sender.id).toBe(senderId);
      expect(incomingRequest?.status).toBe(RequestStatus.PENDING);
    });

    it('не возвращает чужую заявку постороннему пользователю', async () => {
      const createdRequest = await createRequest();

      const response = await request(httpServer)
        .get('/api/requests/incoming')
        .set('Authorization', `Bearer ${outsiderAccessToken}`)
        .expect(200);

      const body = response.body as RequestResponse[];
      expect(body.some((item) => item.id === createdRequest.id)).toBe(false);
    });
  });

  describe('GET /api/requests/outgoing', () => {
    it('возвращает заявку в исходящих у отправителя', async () => {
      const createdRequest = await createRequest();

      const response = await request(httpServer)
        .get('/api/requests/outgoing')
        .set('Authorization', `Bearer ${senderAccessToken}`)
        .expect(200);

      const body = response.body as RequestResponse[];

      const outgoingRequest = body.find(
        (item) => item.id === createdRequest.id,
      );

      expect(outgoingRequest).toBeDefined();
      expect(outgoingRequest?.sender.id).toBe(senderId);
      expect(outgoingRequest?.receiver.id).toBe(receiverId);
      expect(outgoingRequest?.status).toBe(RequestStatus.PENDING);
    });

    it('не возвращает чужую заявку постороннему пользователю', async () => {
      const createdRequest = await createRequest();

      const response = await request(httpServer)
        .get('/api/requests/outgoing')
        .set('Authorization', `Bearer ${outsiderAccessToken}`)
        .expect(200);

      const body = response.body as RequestResponse[];
      expect(body.some((item) => item.id === createdRequest.id)).toBe(false);
    });
  });

  describe('PATCH /api/requests/:id/read', () => {
    it('позволяет получателю отметить заявку прочитанной', async () => {
      const createdRequest = await createRequest();

      const response = await request(httpServer)
        .patch(`/api/requests/${createdRequest.id}/read`)
        .set('Authorization', `Bearer ${receiverAccessToken}`)
        .expect(200);

      const body = response.body as RequestResponse;

      expect(body.id).toBe(createdRequest.id);
      expect(body.isRead).toBe(true);
      expect(body.status).toBe(RequestStatus.PENDING);

      const savedRequest = await requestRepository.findOne({
        where: {
          id: createdRequest.id,
        },
      });

      expect(savedRequest?.isRead).toBe(true);
    });

    it('возвращает 403, если отправитель отмечает заявку прочитанной', async () => {
      const createdRequest = await createRequest();

      const response = await request(httpServer)
        .patch(`/api/requests/${createdRequest.id}/read`)
        .set('Authorization', `Bearer ${senderAccessToken}`)
        .expect(403);

      const body = response.body as ErrorResponse;
      expect(body.statusCode).toBe(403);
    });
  });

  describe('PATCH /api/requests/:id/accept', () => {
    it('позволяет получателю принять заявку', async () => {
      const createdRequest = await createRequest();

      const response = await request(httpServer)
        .patch(`/api/requests/${createdRequest.id}/accept`)
        .set('Authorization', `Bearer ${receiverAccessToken}`)
        .expect(200);

      const body = response.body as RequestResponse;

      expect(body.id).toBe(createdRequest.id);
      expect(body.status).toBe(RequestStatus.IN_PROGRESS);
      expect(body.isRead).toBe(true);

      const savedRequest = await requestRepository.findOne({
        where: {
          id: createdRequest.id,
        },
      });

      expect(savedRequest?.status).toBe(RequestStatus.IN_PROGRESS);
      expect(savedRequest?.isRead).toBe(true);
    });

    it('добавляет навыки в избранное после принятия заявки', async () => {
      const createdRequest = await createRequest();

      await request(httpServer)
        .patch(`/api/requests/${createdRequest.id}/accept`)
        .set('Authorization', `Bearer ${receiverAccessToken}`)
        .expect(200);

      const sender = await userRepository.findOne({
        where: {
          id: senderId,
        },
        relations: {
          favoriteSkills: true,
        },
      });

      const receiver = await userRepository.findOne({
        where: {
          id: receiverId,
        },
        relations: {
          favoriteSkills: true,
        },
      });

      expect(
        sender?.favoriteSkills.some((skill) => skill.id === requestedSkill.id),
      ).toBe(true);

      expect(
        receiver?.favoriteSkills.some((skill) => skill.id === offeredSkill.id),
      ).toBe(true);
    });

    it('оставляет принятую заявку во входящих и исходящих', async () => {
      const createdRequest = await createRequest();

      await request(httpServer)
        .patch(`/api/requests/${createdRequest.id}/accept`)
        .set('Authorization', `Bearer ${receiverAccessToken}`)
        .expect(200);

      const incomingResponse = await request(httpServer)
        .get('/api/requests/incoming')
        .set('Authorization', `Bearer ${receiverAccessToken}`)
        .expect(200);

      const outgoingResponse = await request(httpServer)
        .get('/api/requests/outgoing')
        .set('Authorization', `Bearer ${senderAccessToken}`)
        .expect(200);

      const incomingBody = incomingResponse.body as RequestResponse[];
      const outgoingBody = outgoingResponse.body as RequestResponse[];

      expect(
        incomingBody.some(
          (item) =>
            item.id === createdRequest.id &&
            item.status === RequestStatus.IN_PROGRESS,
        ),
      ).toBe(true);

      expect(
        outgoingBody.some(
          (item) =>
            item.id === createdRequest.id &&
            item.status === RequestStatus.IN_PROGRESS,
        ),
      ).toBe(true);
    });

    it('возвращает 403, если заявку принимает не получатель', async () => {
      const createdRequest = await createRequest();

      const response = await request(httpServer)
        .patch(`/api/requests/${createdRequest.id}/accept`)
        .set('Authorization', `Bearer ${senderAccessToken}`)
        .expect(403);

      const body = response.body as ErrorResponse;

      expect(body.statusCode).toBe(403);
    });

    it('возвращает 400 при повторном принятии заявки', async () => {
      const createdRequest = await createRequest();

      await request(httpServer)
        .patch(`/api/requests/${createdRequest.id}/accept`)
        .set('Authorization', `Bearer ${receiverAccessToken}`)
        .expect(200);

      const response = await request(httpServer)
        .patch(`/api/requests/${createdRequest.id}/accept`)
        .set('Authorization', `Bearer ${receiverAccessToken}`)
        .expect(400);

      const body = response.body as ErrorResponse;

      expect(body).toEqual(
        expect.objectContaining({
          statusCode: 400,
          message: `Заявка уже имеет статус ${RequestStatus.IN_PROGRESS}`,
        }),
      );
    });
  });

  describe('PATCH /api/requests/:id/reject', () => {
    it('позволяет получателю отклонить заявку', async () => {
      const createdRequest = await createRequest();

      const response = await request(httpServer)
        .patch(`/api/requests/${createdRequest.id}/reject`)
        .set('Authorization', `Bearer ${receiverAccessToken}`)
        .expect(200);

      const body = response.body as RequestResponse;

      expect(body.id).toBe(createdRequest.id);
      expect(body.status).toBe(RequestStatus.REJECTED);
      expect(body.isRead).toBe(true);

      const savedRequest = await requestRepository.findOne({
        where: {
          id: createdRequest.id,
        },
      });

      expect(savedRequest?.status).toBe(RequestStatus.REJECTED);
      expect(savedRequest?.isRead).toBe(true);
    });

    it('убирает отклонённую заявку из входящих и исходящих', async () => {
      const createdRequest = await createRequest();

      await request(httpServer)
        .patch(`/api/requests/${createdRequest.id}/reject`)
        .set('Authorization', `Bearer ${receiverAccessToken}`)
        .expect(200);

      const incomingResponse = await request(httpServer)
        .get('/api/requests/incoming')
        .set('Authorization', `Bearer ${receiverAccessToken}`)
        .expect(200);

      const outgoingResponse = await request(httpServer)
        .get('/api/requests/outgoing')
        .set('Authorization', `Bearer ${senderAccessToken}`)
        .expect(200);

      const incomingBody = incomingResponse.body as RequestResponse[];
      const outgoingBody = outgoingResponse.body as RequestResponse[];

      expect(incomingBody.some((item) => item.id === createdRequest.id)).toBe(
        false,
      );

      expect(outgoingBody.some((item) => item.id === createdRequest.id)).toBe(
        false,
      );
    });

    it('возвращает 403, если заявку отклоняет не получатель', async () => {
      const createdRequest = await createRequest();

      const response = await request(httpServer)
        .patch(`/api/requests/${createdRequest.id}/reject`)
        .set('Authorization', `Bearer ${senderAccessToken}`)
        .expect(403);

      const body = response.body as ErrorResponse;

      expect(body.statusCode).toBe(403);
    });
  });

  describe('DELETE /api/requests/:id', () => {
    it('позволяет отправителю удалить свою заявку', async () => {
      const createdRequest = await createRequest();

      await request(httpServer)
        .delete(`/api/requests/${createdRequest.id}`)
        .set('Authorization', `Bearer ${senderAccessToken}`)
        .expect(200);

      const deletedRequest = await requestRepository.findOne({
        where: {
          id: createdRequest.id,
        },
      });

      expect(deletedRequest).toBeNull();
    });

    it('позволяет администратору удалить чужую заявку', async () => {
      const createdRequest = await createRequest();

      await request(httpServer)
        .delete(`/api/requests/${createdRequest.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(200);

      const deletedRequest = await requestRepository.findOne({
        where: {
          id: createdRequest.id,
        },
      });

      expect(deletedRequest).toBeNull();
    });

    it('возвращает 403, если получатель пытается удалить заявку', async () => {
      const createdRequest = await createRequest();

      const response = await request(httpServer)
        .delete(`/api/requests/${createdRequest.id}`)
        .set('Authorization', `Bearer ${receiverAccessToken}`)
        .expect(403);

      const body = response.body as ErrorResponse;

      expect(body.statusCode).toBe(403);

      const savedRequest = await requestRepository.findOne({
        where: {
          id: createdRequest.id,
        },
      });

      expect(savedRequest).not.toBeNull();
    });

    it('возвращает 403, если посторонний пользователь удаляет заявку', async () => {
      const createdRequest = await createRequest();

      const response = await request(httpServer)
        .delete(`/api/requests/${createdRequest.id}`)
        .set('Authorization', `Bearer ${outsiderAccessToken}`)
        .expect(403);

      const body = response.body as ErrorResponse;

      expect(body.statusCode).toBe(403);

      const savedRequest = await requestRepository.findOne({
        where: {
          id: createdRequest.id,
        },
      });

      expect(savedRequest).not.toBeNull();
    });
  });
});
