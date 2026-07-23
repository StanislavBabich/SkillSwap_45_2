import { ApiProperty } from '@nestjs/swagger';

export class FileUploadResponseDto {
  @ApiProperty({
    description: 'Public URL of the uploaded image',
    example: '/uploads/550e8400-e29b-41d4-a716-446655440000.png',
  })
  url!: string;
}
