import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsDateString, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { UserGender } from '../user.enums';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Alex Smith' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'Backend developer' })
  @IsOptional()
  @IsString()
  about?: string;

  @ApiPropertyOptional({ example: '1995-05-20', format: 'date' })
  @IsOptional()
  @IsDateString()
  birthdate?: string;

  @ApiPropertyOptional({ example: 'Moscow' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ enum: UserGender, example: UserGender.OTHER })
  @IsOptional()
  @IsEnum(UserGender)
  gender?: UserGender;

  @ApiPropertyOptional({
    example: 'https://example.com/avatar.jpg',
    format: 'uri',
  })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiPropertyOptional({
    description: 'Category IDs the user wants to learn',
    type: [String],
    example: ['550e8400-e29b-41d4-a716-446655440000'],
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  wantToLearn?: string[];
}