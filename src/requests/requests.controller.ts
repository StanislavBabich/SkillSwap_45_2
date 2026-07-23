import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { TJwtUser } from '../auth/auth.types';
import { UserRole } from '../users/user.enums';
import {
  SwaggerCreateRequest,
  SwaggerGetIncoming,
  SwaggerGetOutgoing,
  SwaggerMarkAsRead,
  SwaggerAcceptRequest,
  SwaggerRejectRequest,
  SwaggerDeleteRequest,
} from './requests.swagger';

@ApiTags('Requests')
@Controller('requests')
@UseGuards(AccessTokenGuard)
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Post()
  @SwaggerCreateRequest()
  create(
    @Body() createRequestDto: CreateRequestDto,
    @CurrentUser() user: TJwtUser,
  ) {
    return this.requestsService.create(createRequestDto, user.id);
  }

  @Get('incoming')
  @SwaggerGetIncoming()
  getIncoming(@CurrentUser() user: TJwtUser) {
    return this.requestsService.getIncoming(user.id);
  }

  @Get('outgoing')
  @SwaggerGetOutgoing()
  getOutgoing(@CurrentUser() user: TJwtUser) {
    return this.requestsService.getOutgoing(user.id);
  }

  @Patch(':id/read')
  @SwaggerMarkAsRead()
  markAsRead(@Param('id') id: string, @CurrentUser() user: TJwtUser) {
    return this.requestsService.markAsRead(id, user.id);
  }

  @Patch(':id/accept')
  @SwaggerAcceptRequest()
  accept(@Param('id') id: string, @CurrentUser() user: TJwtUser) {
    return this.requestsService.accept(id, user.id);
  }

  @Patch(':id/reject')
  @SwaggerRejectRequest()
  reject(@Param('id') id: string, @CurrentUser() user: TJwtUser) {
    return this.requestsService.reject(id, user.id);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles([UserRole.ADMIN])
  @SwaggerDeleteRequest()
  remove(@Param('id') id: string, @CurrentUser() user: TJwtUser) {
    return this.requestsService.remove(id, user.id, user.role);
  }
}
