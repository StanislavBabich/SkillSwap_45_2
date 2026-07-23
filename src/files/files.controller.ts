import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Express } from 'express';
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

const fileFilter = (
  _req: any,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
  ];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    callback(
      new BadRequestException(
        'Недопустимый формат файла. Разрешены: JPEG, PNG, GIF, WEBP',
      ),
      false,
    );
    return;
  }

  callback(null, true);
};

@ApiTags('Files')
@Controller('files')
export class FilesController {
  @Post('upload')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Upload an image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
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
  })
  @ApiCreatedResponse({
    description: 'Image uploaded successfully',
    type: FileUploadResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'File is missing or has an unsupported format',
  })
  @ApiPayloadTooLargeResponse({
    description: 'File exceeds the 2 MB size limit',
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public/uploads',
        filename: (req, file, callback) => {
          const uniqueName = uuidv4();
          const extension = extname(file.originalname);
          callback(null, `${uniqueName}${extension}`);
        },
      }),
      limits: {
        fileSize: 2 * 1024 * 1024, // 2 MB
      },
      fileFilter,
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Файл не загружен');
    }

    return {
      url: `/uploads/${file.filename}`,
    };
  }
}
