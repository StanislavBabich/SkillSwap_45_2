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
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { TJwtUser } from '../auth/auth.types';
import { UserRole } from '../users/user.enums';

@Controller('requests')
@UseGuards(AccessTokenGuard)
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  // создать заявку
  @Post()
  create(
    @Body() createRequestDto: CreateRequestDto,
    @CurrentUser() user: TJwtUser,
  ) {
    return this.requestsService.create(createRequestDto, user.id);
  }

  // входящие заявки
  @Get('incoming')
  getIncoming(@CurrentUser() user: TJwtUser) {
    return this.requestsService.getIncoming(user.id);
  }

  // исходящие заявки
  @Get('outgoing')
  getOutgoing(@CurrentUser() user: TJwtUser) {
    return this.requestsService.getOutgoing(user.id);
  }

  // отметить заявку как прочитанную
  @Patch(':id/read')
  markAsRead(@Param('id') id: string, @CurrentUser() user: TJwtUser) {
    return this.requestsService.markAsRead(id, user.id);
  }

  // принять заявку
  @Patch(':id/accept')
  accept(@Param('id') id: string, @CurrentUser() user: TJwtUser) {
    return this.requestsService.accept(id, user.id);
  }

  // отклонить заявку
  @Patch(':id/reject')
  reject(@Param('id') id: string, @CurrentUser() user: TJwtUser) {
    return this.requestsService.reject(id, user.id);
  }

  // удалить заявку
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles([UserRole.ADMIN])
  remove(@Param('id') id: string, @CurrentUser() user: TJwtUser) {
    return this.requestsService.remove(id, user.id, user.role);
  }
}
