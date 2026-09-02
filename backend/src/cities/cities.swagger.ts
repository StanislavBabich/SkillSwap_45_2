import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UpdateCityDto } from './dto/update-city.dto';
import { CreateCityDto } from './dto/create-city.dto';
import { FindCitiesQueryDto } from './dto/find-cities-query.dto';
import { City } from './entities/city.entity';

export function ApiCitiesController() {
  return applyDecorators(
    ApiTags('Cities'),
    ApiExtraModels(City, CreateCityDto, FindCitiesQueryDto, UpdateCityDto),
  );
}

export function ApiGetCities() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get up to 10 cities, optionally filtered by name',
    }),
    ApiQuery({
      name: 'search',
      required: false,
      description: 'Case-insensitive substring to search for in city names',
      example: 'mosc',
    }),
    ApiOkResponse({
      description: 'Cities returned successfully',
      type: City,
      isArray: true,
    }),
    ApiBadRequestResponse({ description: 'Invalid search query' }),
  );
}

export function ApiCreateCity() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Create a city (admin only)' }),
    ApiCreatedResponse({
      description: 'City created successfully',
      type: City,
    }),
    ApiBadRequestResponse({ description: 'Invalid request body' }),
    ApiUnauthorizedResponse({ description: 'Authentication required' }),
    ApiForbiddenResponse({ description: 'Administrator access required' }),
    ApiConflictResponse({ description: 'City with this name already exists' }),
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
