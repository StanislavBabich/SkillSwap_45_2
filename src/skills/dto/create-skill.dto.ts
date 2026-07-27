import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSkillDto {
  @ApiProperty({ example: 'NestJS development', minLength: 3 })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title!: string;

  @ApiPropertyOptional({
    example: 'I can teach backend development with NestJS',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    type: [String],
    example: ['/uploads/skill-example.png'],
  })
  @IsOptional()
  @IsArray()
  images?: string[];

  @ApiPropertyOptional({
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  categoryId?: string;
}
