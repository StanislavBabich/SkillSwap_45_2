"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiUsersController = ApiUsersController;
exports.ApiCreateUser = ApiCreateUser;
exports.ApiGetUsers = ApiGetUsers;
exports.ApiGetCurrentUser = ApiGetCurrentUser;
exports.ApiUpdateCurrentUser = ApiUpdateCurrentUser;
exports.ApiChangeCurrentUserPassword = ApiChangeCurrentUserPassword;
exports.ApiGetUser = ApiGetUser;
exports.ApiUpdateUser = ApiUpdateUser;
exports.ApiDeleteUser = ApiDeleteUser;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const update_user_dto_1 = require("./dto/update-user.dto");
const user_entity_1 = require("./entities/user.entity");
function ApiUsersController() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiTags)('Users'));
}
function ApiCreateUser() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Create a user' }), (0, swagger_1.ApiCreatedResponse)({
        description: 'User created successfully',
        type: user_entity_1.User,
    }), (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid request body' }), (0, swagger_1.ApiConflictResponse)({
        description: 'A user with this email already exists',
    }));
}
function ApiGetUsers() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Get all users' }), (0, swagger_1.ApiOkResponse)({
        description: 'List of users',
        type: user_entity_1.User,
        isArray: true,
    }));
}
function ApiGetCurrentUser() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Get the current user profile' }), (0, swagger_1.ApiOkResponse)({ description: 'Current user profile', type: user_entity_1.User }), (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Authentication required' }), (0, swagger_1.ApiNotFoundResponse)({ description: 'User not found' }));
}
function ApiUpdateCurrentUser() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Update the current user profile' }), (0, swagger_1.ApiOkResponse)({
        description: 'Current user profile updated successfully',
        type: user_entity_1.User,
    }), (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid request body' }), (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Authentication required' }), (0, swagger_1.ApiNotFoundResponse)({ description: 'User not found' }));
}
function ApiChangeCurrentUserPassword() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Change the current user password' }), (0, swagger_1.ApiOkResponse)({
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
    }), (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid request body' }), (0, swagger_1.ApiUnauthorizedResponse)({
        description: 'Authentication required or current password is incorrect',
    }), (0, swagger_1.ApiNotFoundResponse)({ description: 'User not found' }));
}
function ApiGetUser() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Get a user by ID' }), (0, swagger_1.ApiParam)({ name: 'id', description: 'User identifier', format: 'uuid' }), (0, swagger_1.ApiOkResponse)({ description: 'User found', type: user_entity_1.User }), (0, swagger_1.ApiNotFoundResponse)({ description: 'User not found' }));
}
function ApiUpdateUser() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Update a user by ID' }), (0, swagger_1.ApiParam)({ name: 'id', description: 'User identifier', format: 'uuid' }), (0, swagger_1.ApiBody)({ type: update_user_dto_1.UpdateUserDto }), (0, swagger_1.ApiOkResponse)({ description: 'User updated successfully', type: user_entity_1.User }), (0, swagger_1.ApiBadRequestResponse)({ description: 'Invalid request body' }), (0, swagger_1.ApiNotFoundResponse)({ description: 'User not found' }));
}
function ApiDeleteUser() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Delete a user by ID' }), (0, swagger_1.ApiParam)({ name: 'id', description: 'User identifier', format: 'uuid' }), (0, swagger_1.ApiOkResponse)({ description: 'User deleted successfully' }), (0, swagger_1.ApiNotFoundResponse)({ description: 'User not found' }));
}
//# sourceMappingURL=users.swagger.js.map