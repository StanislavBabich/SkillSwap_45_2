import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import {
  ApiChangeCurrentUserPassword,
  ApiCreateUser,
  ApiDeleteUser,
  ApiGetCurrentUser,
  ApiGetUser,
  ApiGetUsers,
  ApiUpdateCurrentUser,
  ApiUpdateUser,
  ApiUsersController,
} from './users.swagger';
import { Request } from 'express';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UsersService } from './users.service';

// Импорты гард Юля и Дарья ещё делают
// import { AccessTokenGuard } from '../auth/guards/access-token.guard';

@ApiUsersController()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiCreateUser()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiGetUsers()
  findAll() {
    return this.usersService.findAll();
  }

  // 🔒 Защищённый эндпоинт — только авторизованные
  // @UseGuards(AccessTokenGuard)
  @Get('me')
  @ApiGetCurrentUser()
  getMe(@Req() req: Request) {
    const userId = (req.user as { sub: string }).sub;
    return this.usersService.findOne(userId);
  }

  // 🔒 Защищённый эндпоинт
  // @UseGuards(AccessTokenGuard)
  @Patch('me')
  @ApiUpdateCurrentUser()
  updateMe(@Req() req: Request, @Body() dto: UpdateProfileDto) {
    const userId = (req.user as { sub: string }).sub;
    return this.usersService.updateProfile(userId, dto);
  }

  // 🔒 Защищённый эндпоинт
  // @UseGuards(AccessTokenGuard)
  @Patch('me/password')
  @ApiChangeCurrentUserPassword()
  changePassword(@Req() req: Request, @Body() dto: ChangePasswordDto) {
    const userId = (req.user as { sub: string }).sub;
    return this.usersService.changePassword(userId, dto);
  }

  @Get(':id')
  @ApiGetUser()
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiUpdateUser()
  update(
    @Param('id') id: string,
    @Body() updateUserDto: Record<string, unknown>,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiDeleteUser()
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
