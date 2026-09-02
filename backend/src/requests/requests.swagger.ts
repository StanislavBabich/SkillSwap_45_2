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
    ApiOperation({ summary: 'Create a skill exchange request' }),
    ApiBearerAuth(),
    ApiBody({ type: CreateRequestDto }),
    ApiCreatedResponse({ description: 'Request created successfully' }),
    ApiUnauthorizedResponse({ description: 'Authorization required' }),
    ApiNotFoundResponse({ description: 'Skill or recipient not found' }),
  );
}

export function SwaggerGetIncoming() {
  return applyDecorators(
    ApiOperation({ summary: 'Get incoming requests (pending/inProgress)' }),
    ApiBearerAuth(),
    ApiOkResponse({ description: 'List of incoming requests' }),
    ApiUnauthorizedResponse({ description: 'Authorization required' }),
  );
}

export function SwaggerGetOutgoing() {
  return applyDecorators(
    ApiOperation({ summary: 'Get outgoing requests (pending/inProgress)' }),
    ApiBearerAuth(),
    ApiOkResponse({ description: 'List of outgoing requests' }),
    ApiUnauthorizedResponse({ description: 'Authorization required' }),
  );
}

export function SwaggerMarkAsRead() {
  return applyDecorators(
    ApiOperation({ summary: 'Mark request as read' }),
    ApiBearerAuth(),
    ApiOkResponse({ description: 'Request marked as read' }),
    ApiUnauthorizedResponse({ description: 'Authorization required' }),
    ApiNotFoundResponse({ description: 'Request not found' }),
  );
}

export function SwaggerAcceptRequest() {
  return applyDecorators(
    ApiOperation({ summary: 'Accept a request (add skills to favorites)' }),
    ApiBearerAuth(),
    ApiOkResponse({ description: 'Request accepted' }),
    ApiUnauthorizedResponse({ description: 'Authorization required' }),
    ApiForbiddenResponse({ description: 'Insufficient permissions' }),
    ApiNotFoundResponse({ description: 'Request not found' }),
  );
}

export function SwaggerRejectRequest() {
  return applyDecorators(
    ApiOperation({ summary: 'Reject a request' }),
    ApiBearerAuth(),
    ApiOkResponse({ description: 'Request rejected' }),
    ApiUnauthorizedResponse({ description: 'Authorization required' }),
    ApiForbiddenResponse({ description: 'Insufficient permissions' }),
    ApiNotFoundResponse({ description: 'Request not found' }),
  );
}

export function SwaggerDeleteRequest() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete a request (own only; admin can delete any)' }),
    ApiBearerAuth(),
    ApiOkResponse({ description: 'Request deleted' }),
    ApiUnauthorizedResponse({ description: 'Authorization required' }),
    ApiForbiddenResponse({ description: 'Insufficient permissions' }),
    ApiNotFoundResponse({ description: 'Request not found' }),
  );
}
