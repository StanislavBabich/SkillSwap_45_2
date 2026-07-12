import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  //UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

// Импорты гард Юля и Дарья ещё делают
// import { AccessTokenGuard } from '../auth/guards/access-token.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // 🔒 Защищённый эндпоинт — только авторизованные
  // @UseGuards(AccessTokenGuard)
  @Get('me')
  getMe(@Req() req: Request) {
    const userId = (req.user as { sub: string }).sub;
    return this.usersService.findOne(userId);
  }

  // 🔒 Защищённый эндпоинт
  // @UseGuards(AccessTokenGuard)
  @Patch('me')
  updateMe(@Req() req: Request, @Body() dto: UpdateProfileDto) {
    const userId = (req.user as { sub: string }).sub;
    return this.usersService.updateProfile(userId, dto);
  }

  // 🔒 Защищённый эндпоинт
  // @UseGuards(AccessTokenGuard)
  @Patch('me/password')
  changePassword(@Req() req: Request, @Body() dto: ChangePasswordDto) {
    const userId = (req.user as { sub: string }).sub;
    return this.usersService.changePassword(userId, dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: Record<string, unknown>,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
