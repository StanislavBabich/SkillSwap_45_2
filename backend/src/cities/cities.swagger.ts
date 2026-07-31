import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UpdateCityDto } from './dto/update-city.dto';
import { City } from './entities/city.entity';

export function ApiCitiesController() {
  return applyDecorators(
    ApiTags('Cities'),
    ApiExtraModels(City, UpdateCityDto),
  );
}

export function ApiUpdateCity() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Update a city (admin only)' }),
    ApiParam({
      name: 'id',
      description: 'City identifier',
      format: 'uuid',
    }),
    ApiOkResponse({
      description: 'City updated successfully',
      type: City,
    }),
    ApiBadRequestResponse({
      description: 'Invalid city identifier or request body',
    }),
    ApiUnauthorizedResponse({ description: 'Authentication required' }),
    ApiForbiddenResponse({ description: 'Administrator access required' }),
    ApiNotFoundResponse({ description: 'City not found' }),
  );
}

export function ApiDeleteCity() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Delete a city (admin only)' }),
    ApiParam({
      name: 'id',
      description: 'City identifier',
      format: 'uuid',
    }),
    ApiNoContentResponse({ description: 'City deleted successfully' }),
    ApiBadRequestResponse({ description: 'Invalid city identifier' }),
    ApiUnauthorizedResponse({ description: 'Authentication required' }),
    ApiForbiddenResponse({ description: 'Administrator access required' }),
    ApiNotFoundResponse({ description: 'City not found' }),
  );
}
