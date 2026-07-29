import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { TJwtUser } from '../auth/auth.types';
export declare class RequestsController {
    private readonly requestsService;
    constructor(requestsService: RequestsService);
    create(createRequestDto: CreateRequestDto, user: TJwtUser): Promise<import("./dto/request-response.dto").RequestResponseDto>;
    getIncoming(user: TJwtUser): Promise<import("./dto/request-response.dto").RequestResponseDto[]>;
    getOutgoing(user: TJwtUser): Promise<import("./dto/request-response.dto").RequestResponseDto[]>;
    markAsRead(id: string, user: TJwtUser): Promise<import("./dto/request-response.dto").RequestResponseDto>;
    accept(id: string, user: TJwtUser): Promise<import("./dto/request-response.dto").RequestResponseDto>;
    reject(id: string, user: TJwtUser): Promise<import("./dto/request-response.dto").RequestResponseDto>;
    remove(id: string, user: TJwtUser): Promise<void>;
}
