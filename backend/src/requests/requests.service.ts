import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { EntityNotFoundException } from '../common/exceptions/entity-not-found.exception';
// DTO
import { CreateRequestDto } from './dto/create-request.dto';
import { RequestResponseDto } from './dto/request-response.dto';
//Сущности
import { Request } from './entities/request.entity';
import { RequestStatus } from './request-status.enums';
import { User } from '../users/entities/user.entity';
import { Skill } from '../skills/entities/skill.entity';
import { UserRole } from '../users/user.enums';
// Сервисы
import { UsersService } from '../users/users.service';
import { SkillsService } from '../skills/skills.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { NotificationType } from '../notifications/notification.types';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(Request)
    private readonly requestRepository: Repository<Request>,
    private readonly usersService: UsersService,
    private readonly skillsService: SkillsService,
    private readonly notificationsGateway: NotificationsGateway,
  ) {}

  // СОЗДАТЬ ЗАЯВКУ
  async create(
    createRequestDto: CreateRequestDto,
    senderId: string,
  ): Promise<RequestResponseDto> {
    await this.usersService.findOne(senderId);
    await this.usersService.findOne(createRequestDto.receiverId);

    if (senderId === createRequestDto.receiverId) {
      throw new BadRequestException('You cannot send a request to yourself');
    }

    await this.skillsService.findOne(createRequestDto.offeredSkillId);
    await this.skillsService.findOne(createRequestDto.requestedSkillId);

    // Создаем заявку через связи (передаем объекты с ID)
    const request = this.requestRepository.create({
      sender: { id: senderId } as User,
      receiver: { id: createRequestDto.receiverId } as User,
      offeredSkill: { id: createRequestDto.offeredSkillId } as Skill,
      requestedSkill: { id: createRequestDto.requestedSkillId } as Skill,
      status: RequestStatus.PENDING,
      isRead: false,
    });

    const savedRequest = await this.requestRepository.save(request);

    const result = await this.loadRequestWithRelations(savedRequest.id);

    this.notificationsGateway.notifyUser(result.receiver.id, {
      type: NotificationType.NEW_REQUEST,
      skillName: result.requestedSkill.title,
      user: {
        id: result.sender.id,
        name: result.sender.name,
      },
    });

    return plainToInstance(RequestResponseDto, result);
  }

  // ВХОДЯЩИЕ ЗАЯВКИ
  async getIncoming(userId: string): Promise<RequestResponseDto[]> {
    await this.usersService.findOne(userId);

    const requests = await this.createBaseQueryBuilder()
      .where('receiver.id = :userId', { userId })
      .andWhere('request.status IN (:...statuses)', {
        statuses: [RequestStatus.PENDING, RequestStatus.IN_PROGRESS],
      })
      .orderBy('request.createdAt', 'DESC')
      .getMany();

    return this.toResponseDtos(requests);
  }

  // ИСХОДЯЩИЕ ЗАЯВКИ
  async getOutgoing(userId: string): Promise<RequestResponseDto[]> {
    // Проверяем, что пользователь существует
    await this.usersService.findOne(userId);

    const requests = await this.createBaseQueryBuilder()
      .where('sender.id = :userId', { userId })
      .andWhere('request.status IN (:...statuses)', {
        statuses: [RequestStatus.PENDING, RequestStatus.IN_PROGRESS],
      })
      .orderBy('request.createdAt', 'DESC')
      .getMany();

    return this.toResponseDtos(requests);
  }

  // ОТМЕТИТЬ ЗАЯВКУ КАК ПРОЧИТАННУЮ
  async markAsRead(id: string, userId: string): Promise<RequestResponseDto> {
    const request = await this.loadRequestWithRelations(id);

    if (request.receiver.id !== userId) {
      throw new ForbiddenException(
        'You cannot mark this request as read',
      );
    }

    if (request.isRead) {
      return this.toResponseDto(request);
    }

    request.isRead = true;
    await this.requestRepository.save(request);

    const updatedRequest = await this.loadRequestWithRelations(id);
    return this.toResponseDto(updatedRequest);
  }

  // ПРИНЯТЬ ЗАЯВКУ
  async accept(id: string, userId: string): Promise<RequestResponseDto> {
    const request = await this.loadRequestWithRelations(id);

    if (request.receiver.id !== userId) {
      throw new ForbiddenException(
        'You cannot accept this request: you are not the recipient',
      );
    }

    if (request.status !== RequestStatus.PENDING) {
      throw new BadRequestException(
        `Request already has status ${request.status}`,
      );
    }

    // Добавляем навыки в избранное пользователям
    // Отправителю добавляем requestedSkill
    await this.usersService.addFavoriteSkill(
      request.sender.id,
      request.requestedSkill.id,
    );

    // Получателю (текущему пользователю) добавляем offeredSkill
    await this.usersService.addFavoriteSkill(
      request.receiver.id,
      request.offeredSkill.id,
    );

    request.status = RequestStatus.IN_PROGRESS;
    request.isRead = true;

    await this.requestRepository.save(request);

    const updatedRequest = await this.loadRequestWithRelations(id);

    this.notificationsGateway.notifyUser(updatedRequest.sender.id, {
      type: NotificationType.REQUEST_ACCEPTED,
      skillName: updatedRequest.requestedSkill.title,
      user: {
        id: updatedRequest.receiver.id,
        name: updatedRequest.receiver.name,
      },
    });

    return this.toResponseDto(updatedRequest);
  }

  // ОТКЛОНИТЬ ЗАЯВКУ
  async reject(id: string, userId: string): Promise<RequestResponseDto> {
    const request = await this.loadRequestWithRelations(id);

    if (request.receiver.id !== userId) {
      throw new ForbiddenException(
        'You cannot reject this request: you are not the recipient',
      );
    }

    if (request.status !== RequestStatus.PENDING) {
      throw new BadRequestException(
        `Request already has status ${request.status}`,
      );
    }

    request.status = RequestStatus.REJECTED;
    request.isRead = true;

    await this.requestRepository.save(request);

    const updatedRequest = await this.loadRequestWithRelations(id);

    this.notificationsGateway.notifyUser(updatedRequest.sender.id, {
      type: NotificationType.REQUEST_REJECTED,
      skillName: updatedRequest.requestedSkill.title,
      user: {
        id: updatedRequest.receiver.id,
        name: updatedRequest.receiver.name,
      },
    });

    return this.toResponseDto(updatedRequest);
  }

  // УДАЛИТЬ ЗАЯВКУ
  async remove(id: string, userId: string, userRole: UserRole): Promise<void> {
    const request = await this.loadRequestWithRelations(id);

    const isAdmin = userRole === UserRole.ADMIN;
    const isSender = request.sender.id === userId;

    if (!isAdmin && !isSender) {
      throw new ForbiddenException(
        'You cannot delete this request. Only the sender or an administrator can delete a request.',
      );
    }

    await this.requestRepository.remove(request);
  }

  // ====== ПРИВАТНЫЕ МЕТОДЫ ======

  // Возвращает список полей для выборки из БД (сокращенный минимум данных)
  private getSelectFields(): string[] {
    return [
      'request.id',
      'request.status',
      'request.isRead',
      'request.createdAt',
      'sender.id',
      'sender.name',
      'sender.email',
      'sender.avatar',
      'receiver.id',
      'receiver.name',
      'receiver.email',
      'receiver.avatar',
      'offeredSkill.id',
      'offeredSkill.title',
      'offeredSkill.description',
      'requestedSkill.id',
      'requestedSkill.title',
      'requestedSkill.description',
    ];
  }

  // Базовый QueryBuilder с загрузкой всех связей и выборкой полей
  private createBaseQueryBuilder() {
    return this.requestRepository
      .createQueryBuilder('request')
      .leftJoinAndSelect('request.sender', 'sender')
      .leftJoinAndSelect('request.receiver', 'receiver')
      .leftJoinAndSelect('request.offeredSkill', 'offeredSkill')
      .leftJoinAndSelect('request.requestedSkill', 'requestedSkill')
      .select(this.getSelectFields()); // используем сокращенный селект
  }

  // Загружает одну заявку с полными данными
  private async loadRequestWithRelations(id: string): Promise<Request> {
    const result = await this.createBaseQueryBuilder()
      .where('request.id = :id', { id })
      .getOne();

    if (!result) {
      throw new EntityNotFoundException('Request', id);
    }
    return result;
  }

  // Трансформирует сущность Request в RequestResponseDto
  private toResponseDto(request: Request): RequestResponseDto {
    return plainToInstance(RequestResponseDto, request);
  }

  // Трансформирует массив сущностей в массив DTO (если массив заявок)
  private toResponseDtos(requests: Request[]): RequestResponseDto[] {
    return requests.map((request) => this.toResponseDto(request));
  }
}
