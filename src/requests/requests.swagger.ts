import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateRequestDto } from './dto/create-request.dto';

export function SwaggerCreateRequest() {
  return applyDecorators(
    ApiOperation({ summary: 'Создать заявку на обмен' }),
    ApiBearerAuth(),
    ApiBody({ type: CreateRequestDto }),
    ApiCreatedResponse({ description: 'Заявка успешно создана' }),
    ApiUnauthorizedResponse({ description: 'Требуется авторизация' }),
    ApiNotFoundResponse({ description: 'Навык или получатель не найден' }),
  );
}

export function SwaggerGetIncoming() {
  return applyDecorators(
    ApiOperation({ summary: 'Получить входящие заявки (pending/inProgress)' }),
    ApiBearerAuth(),
    ApiOkResponse({ description: 'Список входящих заявок' }),
    ApiUnauthorizedResponse({ description: 'Требуется авторизация' }),
  );
}

export function SwaggerGetOutgoing() {
  return applyDecorators(
    ApiOperation({ summary: 'Получить исходящие заявки (pending/inProgress)' }),
    ApiBearerAuth(),
    ApiOkResponse({ description: 'Список исходящих заявок' }),
    ApiUnauthorizedResponse({ description: 'Требуется авторизация' }),
  );
}

export function SwaggerMarkAsRead() {
  return applyDecorators(
    ApiOperation({ summary: 'Отметить заявку как прочитанную' }),
    ApiBearerAuth(),
    ApiOkResponse({ description: 'Заявка отмечена прочитанной' }),
    ApiUnauthorizedResponse({ description: 'Требуется авторизация' }),
    ApiNotFoundResponse({ description: 'Заявка не найдена' }),
  );
}

export function SwaggerAcceptRequest() {
  return applyDecorators(
    ApiOperation({ summary: 'Принять заявку (добавить навыки в избранное)' }),
    ApiBearerAuth(),
    ApiOkResponse({ description: 'Заявка принята' }),
    ApiUnauthorizedResponse({ description: 'Требуется авторизация' }),
    ApiForbiddenResponse({ description: 'Недостаточно прав' }),
    ApiNotFoundResponse({ description: 'Заявка не найдена' }),
  );
}

export function SwaggerRejectRequest() {
  return applyDecorators(
    ApiOperation({ summary: 'Отклонить заявку' }),
    ApiBearerAuth(),
    ApiOkResponse({ description: 'Заявка отклонена' }),
    ApiUnauthorizedResponse({ description: 'Требуется авторизация' }),
    ApiForbiddenResponse({ description: 'Недостаточно прав' }),
    ApiNotFoundResponse({ description: 'Заявка не найдена' }),
  );
}

export function SwaggerDeleteRequest() {
  return applyDecorators(
    ApiOperation({ summary: 'Удалить заявку (только свои, админ — любые)' }),
    ApiBearerAuth(),
    ApiOkResponse({ description: 'Заявка удалена' }),
    ApiUnauthorizedResponse({ description: 'Требуется авторизация' }),
    ApiForbiddenResponse({ description: 'Недостаточно прав' }),
    ApiNotFoundResponse({ description: 'Заявка не найдена' }),
  );
}
