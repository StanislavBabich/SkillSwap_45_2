"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwaggerCreateRequest = SwaggerCreateRequest;
exports.SwaggerGetIncoming = SwaggerGetIncoming;
exports.SwaggerGetOutgoing = SwaggerGetOutgoing;
exports.SwaggerMarkAsRead = SwaggerMarkAsRead;
exports.SwaggerAcceptRequest = SwaggerAcceptRequest;
exports.SwaggerRejectRequest = SwaggerRejectRequest;
exports.SwaggerDeleteRequest = SwaggerDeleteRequest;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const create_request_dto_1 = require("./dto/create-request.dto");
function SwaggerCreateRequest() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Создать заявку на обмен' }), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiBody)({ type: create_request_dto_1.CreateRequestDto }), (0, swagger_1.ApiCreatedResponse)({ description: 'Заявка успешно создана' }), (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Требуется авторизация' }), (0, swagger_1.ApiNotFoundResponse)({ description: 'Навык или получатель не найден' }));
}
function SwaggerGetIncoming() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Получить входящие заявки (pending/inProgress)' }), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOkResponse)({ description: 'Список входящих заявок' }), (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Требуется авторизация' }));
}
function SwaggerGetOutgoing() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Получить исходящие заявки (pending/inProgress)' }), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOkResponse)({ description: 'Список исходящих заявок' }), (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Требуется авторизация' }));
}
function SwaggerMarkAsRead() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Отметить заявку как прочитанную' }), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOkResponse)({ description: 'Заявка отмечена прочитанной' }), (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Требуется авторизация' }), (0, swagger_1.ApiNotFoundResponse)({ description: 'Заявка не найдена' }));
}
function SwaggerAcceptRequest() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Принять заявку (добавить навыки в избранное)' }), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOkResponse)({ description: 'Заявка принята' }), (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Требуется авторизация' }), (0, swagger_1.ApiForbiddenResponse)({ description: 'Недостаточно прав' }), (0, swagger_1.ApiNotFoundResponse)({ description: 'Заявка не найдена' }));
}
function SwaggerRejectRequest() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Отклонить заявку' }), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOkResponse)({ description: 'Заявка отклонена' }), (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Требуется авторизация' }), (0, swagger_1.ApiForbiddenResponse)({ description: 'Недостаточно прав' }), (0, swagger_1.ApiNotFoundResponse)({ description: 'Заявка не найдена' }));
}
function SwaggerDeleteRequest() {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiOperation)({ summary: 'Удалить заявку (только свои, админ — любые)' }), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOkResponse)({ description: 'Заявка удалена' }), (0, swagger_1.ApiUnauthorizedResponse)({ description: 'Требуется авторизация' }), (0, swagger_1.ApiForbiddenResponse)({ description: 'Недостаточно прав' }), (0, swagger_1.ApiNotFoundResponse)({ description: 'Заявка не найдена' }));
}
//# sourceMappingURL=requests.swagger.js.map