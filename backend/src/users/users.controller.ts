import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
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
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UsersService } from './users.service';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { AuthRequest } from '../auth/auth.types';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from './user.enums';

@ApiUsersController()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiCreateUser()
  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles([UserRole.ADMIN])
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiGetUsers()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(AccessTokenGuard)
  @Get('me')
  @ApiGetCurrentUser()
  getMe(@Req() req: AuthRequest) {
    const userId = req.user.sub;
    return this.usersService.findCurrentUser(userId);
  }

  @UseGuards(AccessTokenGuard)
  @Patch('me')
  @ApiUpdateCurrentUser()
  updateMe(@Req() req: AuthRequest, @Body() dto: UpdateProfileDto) {
    const userId = req.user.sub;
    return this.usersService.updateProfile(userId, dto);
  }

  @UseGuards(AccessTokenGuard)
  @Patch('me/password')
  @ApiChangeCurrentUserPassword()
  changePassword(@Req() req: AuthRequest, @Body() dto: ChangePasswordDto) {
    const userId = req.user.sub;
    return this.usersService.changePassword(userId, dto);
  }

  @Get(':id')
  @ApiGetUser()
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @UseGuards(AccessTokenGuard)
  @Patch(':id')
  @ApiUpdateUser()
  update(
    @Param('id') id: string,
    @Body() updateUserDto: Record<string, unknown>,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  @ApiDeleteUser()
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
