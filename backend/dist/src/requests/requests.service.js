"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const class_transformer_1 = require("class-transformer");
const entity_not_found_exception_1 = require("../common/exceptions/entity-not-found.exception");
const request_response_dto_1 = require("./dto/request-response.dto");
const request_entity_1 = require("./entities/request.entity");
const request_status_enums_1 = require("./request-status.enums");
const user_enums_1 = require("../users/user.enums");
const users_service_1 = require("../users/users.service");
const skills_service_1 = require("../skills/skills.service");
const notifications_gateway_1 = require("../notifications/notifications.gateway");
const notification_types_1 = require("../notifications/notification.types");
let RequestsService = class RequestsService {
    requestRepository;
    usersService;
    skillsService;
    notificationsGateway;
    constructor(requestRepository, usersService, skillsService, notificationsGateway) {
        this.requestRepository = requestRepository;
        this.usersService = usersService;
        this.skillsService = skillsService;
        this.notificationsGateway = notificationsGateway;
    }
    async create(createRequestDto, senderId) {
        await this.usersService.findOne(senderId);
        await this.usersService.findOne(createRequestDto.receiverId);
        if (senderId === createRequestDto.receiverId) {
            throw new common_1.BadRequestException('Нельзя отправить заявку самому себе');
        }
        await this.skillsService.findOne(createRequestDto.offeredSkillId);
        await this.skillsService.findOne(createRequestDto.requestedSkillId);
        const request = this.requestRepository.create({
            sender: { id: senderId },
            receiver: { id: createRequestDto.receiverId },
            offeredSkill: { id: createRequestDto.offeredSkillId },
            requestedSkill: { id: createRequestDto.requestedSkillId },
            status: request_status_enums_1.RequestStatus.PENDING,
            isRead: false,
        });
        const savedRequest = await this.requestRepository.save(request);
        const result = await this.loadRequestWithRelations(savedRequest.id);
        this.notificationsGateway.notifyUser(result.receiver.id, {
            type: notification_types_1.NotificationType.NEW_REQUEST,
            skillName: result.requestedSkill.title,
            user: {
                id: result.sender.id,
                name: result.sender.name,
            },
        });
        return (0, class_transformer_1.plainToInstance)(request_response_dto_1.RequestResponseDto, result);
    }
    async getIncoming(userId) {
        await this.usersService.findOne(userId);
        const requests = await this.createBaseQueryBuilder()
            .where('receiver.id = :userId', { userId })
            .andWhere('request.status IN (:...statuses)', {
            statuses: [request_status_enums_1.RequestStatus.PENDING, request_status_enums_1.RequestStatus.IN_PROGRESS],
        })
            .orderBy('request.createdAt', 'DESC')
            .getMany();
        return this.toResponseDtos(requests);
    }
    async getOutgoing(userId) {
        await this.usersService.findOne(userId);
        const requests = await this.createBaseQueryBuilder()
            .where('sender.id = :userId', { userId })
            .andWhere('request.status IN (:...statuses)', {
            statuses: [request_status_enums_1.RequestStatus.PENDING, request_status_enums_1.RequestStatus.IN_PROGRESS],
        })
            .orderBy('request.createdAt', 'DESC')
            .getMany();
        return this.toResponseDtos(requests);
    }
    async markAsRead(id, userId) {
        const request = await this.loadRequestWithRelations(id);
        if (request.receiver.id !== userId) {
            throw new common_1.ForbiddenException('Вы не можете отметить эту заявку как прочитанную');
        }
        if (request.isRead) {
            return this.toResponseDto(request);
        }
        request.isRead = true;
        await this.requestRepository.save(request);
        const updatedRequest = await this.loadRequestWithRelations(id);
        return this.toResponseDto(updatedRequest);
    }
    async accept(id, userId) {
        const request = await this.loadRequestWithRelations(id);
        if (request.receiver.id !== userId) {
            throw new common_1.ForbiddenException('Вы не можете принять эту заявку: Вы не являетесь получателем');
        }
        if (request.status !== request_status_enums_1.RequestStatus.PENDING) {
            throw new common_1.BadRequestException(`Заявка уже имеет статус ${request.status}`);
        }
        await this.usersService.addFavoriteSkill(request.sender.id, request.requestedSkill.id);
        await this.usersService.addFavoriteSkill(request.receiver.id, request.offeredSkill.id);
        request.status = request_status_enums_1.RequestStatus.IN_PROGRESS;
        request.isRead = true;
        await this.requestRepository.save(request);
        const updatedRequest = await this.loadRequestWithRelations(id);
        this.notificationsGateway.notifyUser(updatedRequest.sender.id, {
            type: notification_types_1.NotificationType.REQUEST_ACCEPTED,
            skillName: updatedRequest.requestedSkill.title,
            user: {
                id: updatedRequest.receiver.id,
                name: updatedRequest.receiver.name,
            },
        });
        return this.toResponseDto(updatedRequest);
    }
    async reject(id, userId) {
        const request = await this.loadRequestWithRelations(id);
        if (request.receiver.id !== userId) {
            throw new common_1.ForbiddenException('Вы не можете отклонить эту заявку: Вы не являетесь получателем');
        }
        if (request.status !== request_status_enums_1.RequestStatus.PENDING) {
            throw new common_1.BadRequestException(`Заявка уже имеет статус ${request.status}`);
        }
        request.status = request_status_enums_1.RequestStatus.REJECTED;
        request.isRead = true;
        await this.requestRepository.save(request);
        const updatedRequest = await this.loadRequestWithRelations(id);
        this.notificationsGateway.notifyUser(updatedRequest.sender.id, {
            type: notification_types_1.NotificationType.REQUEST_REJECTED,
            skillName: updatedRequest.requestedSkill.title,
            user: {
                id: updatedRequest.receiver.id,
                name: updatedRequest.receiver.name,
            },
        });
        return this.toResponseDto(updatedRequest);
    }
    async remove(id, userId, userRole) {
        const request = await this.loadRequestWithRelations(id);
        const isAdmin = userRole === user_enums_1.UserRole.ADMIN;
        const isSender = request.sender.id === userId;
        if (!isAdmin && !isSender) {
            throw new common_1.ForbiddenException('Вы не можете удалить эту заявку. Только отправитель или администратор могут удалить заявку.');
        }
        await this.requestRepository.remove(request);
    }
    getSelectFields() {
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
    createBaseQueryBuilder() {
        return this.requestRepository
            .createQueryBuilder('request')
            .leftJoinAndSelect('request.sender', 'sender')
            .leftJoinAndSelect('request.receiver', 'receiver')
            .leftJoinAndSelect('request.offeredSkill', 'offeredSkill')
            .leftJoinAndSelect('request.requestedSkill', 'requestedSkill')
            .select(this.getSelectFields());
    }
    async loadRequestWithRelations(id) {
        const result = await this.createBaseQueryBuilder()
            .where('request.id = :id', { id })
            .getOne();
        if (!result) {
            throw new entity_not_found_exception_1.EntityNotFoundException('Request', id);
        }
        return result;
    }
    toResponseDto(request) {
        return (0, class_transformer_1.plainToInstance)(request_response_dto_1.RequestResponseDto, request);
    }
    toResponseDtos(requests) {
        return requests.map((request) => this.toResponseDto(request));
    }
};
exports.RequestsService = RequestsService;
exports.RequestsService = RequestsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(request_entity_1.Request)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService,
        skills_service_1.SkillsService,
        notifications_gateway_1.NotificationsGateway])
], RequestsService);
//# sourceMappingURL=requests.service.js.map