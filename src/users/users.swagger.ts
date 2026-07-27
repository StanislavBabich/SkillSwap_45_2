import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

export function ApiUsersController() {
  return applyDecorators(ApiTags('Users'));
}

export function ApiCreateUser() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a user' }),
    ApiCreatedResponse({
      description: 'User created successfully',
      type: User,
    }),
    ApiBadRequestResponse({ description: 'Invalid request body' }),
    ApiConflictResponse({
      description: 'A user with this email already exists',
    }),
  );
}

export function ApiGetUsers() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all users' }),
    ApiOkResponse({
      description: 'List of users',
      type: User,
      isArray: true,
    }),
  );
}

export function ApiGetCurrentUser() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Get the current user profile' }),
    ApiOkResponse({ description: 'Current user profile', type: User }),
    ApiUnauthorizedResponse({ description: 'Authentication required' }),
    ApiNotFoundResponse({ description: 'User not found' }),
  );
}

export function ApiUpdateCurrentUser() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Update the current user profile' }),
    ApiOkResponse({
      description: 'Current user profile updated successfully',
      type: User,
    }),
    ApiBadRequestResponse({ description: 'Invalid request body' }),
    ApiUnauthorizedResponse({ description: 'Authentication required' }),
    ApiNotFoundResponse({ description: 'User not found' }),
  );
}

export function ApiChangeCurrentUserPassword() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Change the current user password' }),
    ApiOkResponse({
      description: 'Password changed successfully',
      schema: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'Password changed successfully',
          },
        },
      },
    }),
    ApiBadRequestResponse({ description: 'Invalid request body' }),
    ApiUnauthorizedResponse({
      description: 'Authentication required or current password is incorrect',
    }),
    ApiNotFoundResponse({ description: 'User not found' }),
  );
}

export function ApiGetUser() {
  return applyDecorators(
    ApiOperation({ summary: 'Get a user by ID' }),
    ApiParam({ name: 'id', description: 'User identifier', format: 'uuid' }),
    ApiOkResponse({ description: 'User found', type: User }),
    ApiNotFoundResponse({ description: 'User not found' }),
  );
}

export function ApiUpdateUser() {
  return applyDecorators(
    ApiOperation({ summary: 'Update a user by ID' }),
    ApiParam({ name: 'id', description: 'User identifier', format: 'uuid' }),
    ApiBody({ type: UpdateUserDto }),
    ApiOkResponse({ description: 'User updated successfully', type: User }),
    ApiBadRequestResponse({ description: 'Invalid request body' }),
    ApiNotFoundResponse({ description: 'User not found' }),
  );
}

export function ApiDeleteUser() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete a user by ID' }),
    ApiParam({ name: 'id', description: 'User identifier', format: 'uuid' }),
    ApiOkResponse({ description: 'User deleted successfully' }),
    ApiNotFoundResponse({ description: 'User not found' }),
  );
}
