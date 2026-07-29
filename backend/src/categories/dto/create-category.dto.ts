// create-category.dto.ts
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Category name',
    example: 'Programming',
  })
  @IsString()
  name!: string;

  @ApiPropertyOptional({
    description: 'Parent category identifier for a nested category',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  parentId?: string;
}
