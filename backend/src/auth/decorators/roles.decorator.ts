import { Reflector } from '@nestjs/core';
import { UserRole } from '../../users/user.enums';

export const Roles = Reflector.createDecorator<UserRole[]>();
