import { Repository } from 'typeorm';
import { CreateRequestDto } from './dto/create-request.dto';
import { RequestResponseDto } from './dto/request-response.dto';
import { Request } from './entities/request.entity';
import { UserRole } from '../users/user.enums';
import { UsersService } from '../users/users.service';
import { SkillsService } from '../skills/skills.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';
export declare class RequestsService {
    private readonly requestRepository;
    private readonly usersService;
    private readonly skillsService;
    private readonly notificationsGateway;
    constructor(requestRepository: Repository<Request>, usersService: UsersService, skillsService: SkillsService, notificationsGateway: NotificationsGateway);
    create(createRequestDto: CreateRequestDto, senderId: string): Promise<RequestResponseDto>;
    getIncoming(userId: string): Promise<RequestResponseDto[]>;
    getOutgoing(userId: string): Promise<RequestResponseDto[]>;
    markAsRead(id: string, userId: string): Promise<RequestResponseDto>;
    accept(id: string, userId: string): Promise<RequestResponseDto>;
    reject(id: string, userId: string): Promise<RequestResponseDto>;
    remove(id: string, userId: string, userRole: UserRole): Promise<void>;
    private getSelectFields;
    private createBaseQueryBuilder;
    private loadRequestWithRelations;
    private toResponseDto;
    private toResponseDtos;
}
