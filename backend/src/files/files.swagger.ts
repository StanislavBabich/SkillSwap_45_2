import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
  ApiPayloadTooLargeResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileUploadResponseDto } from './dto/file-upload-response.dto';

export function ApiFilesController() {
  return applyDecorators(ApiTags('Files'));
}

export function ApiUploadFile() {
  return applyDecorators(
    ApiOperation({ summary: 'Upload an image' }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      description:
        'Image file in JPEG, PNG, GIF, or WEBP format. Maximum size: 2 MB.',
      schema: {
        type: 'object',
        required: ['file'],
        properties: {
          file: {
            type: 'string',
            format: 'binary',
            description: 'Image file to upload',
          },
        },
      },
    }),
    ApiCreatedResponse({
      description: 'Image uploaded successfully',
      type: FileUploadResponseDto,
    }),
    ApiBadRequestResponse({
      description: 'File is missing or has an unsupported format',
    }),
    ApiPayloadTooLargeResponse({
      description: 'File exceeds the 2 MB size limit',
    }),
  );
}
