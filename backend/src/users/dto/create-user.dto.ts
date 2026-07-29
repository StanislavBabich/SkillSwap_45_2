import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserGender, UserRole } from '../user.enums';

export class CreateUserDto {
  @ApiProperty({ example: 'Alex Smith', minLength: 2, maxLength: 100 })
  @IsString()
  @Length(2, 100)
  name!: string;

  @ApiProperty({ example: 'alex@example.com', format: 'email', maxLength: 255 })
  @IsEmail()
  @MaxLength(255)
  email!: string;

  @ApiProperty({
    example: 'StrongPassword123',
    minLength: 8,
    maxLength: 255,
    writeOnly: true,
  })
  @IsString()
  @MinLength(8)
  @MaxLength(255)
  password!: string;

  @ApiPropertyOptional({
    example: 'Backend developer interested in language exchange',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @Length(0, 1000)
  about?: string;

  @ApiPropertyOptional({ example: '1995-05-20', format: 'date' })
  @IsOptional()
  @IsDateString()
  birthdate?: string;

  @ApiPropertyOptional({ example: 'Moscow', minLength: 2, maxLength: 100 })
  @IsOptional()
  @IsString()
  @Length(2, 100)
  city?: string;

  @ApiPropertyOptional({ enum: UserGender, example: UserGender.OTHER })
  @IsOptional()
  @IsEnum(UserGender)
  gender?: UserGender;

  @ApiPropertyOptional({
    example: 'https://example.com/avatar.jpg',
    format: 'uri',
    maxLength: 500,
  })
  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  avatar?: string;

  @ApiPropertyOptional({
    description: 'Identifiers of skills the user wants to learn',
    type: [String],
    example: ['550e8400-e29b-41d4-a716-446655440000'],
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  wantToLearn?: string[];

  @ApiPropertyOptional({
    description: 'Favorite skill identifiers',
    type: [String],
    example: ['6ba7b810-9dad-41d1-80b4-00c04fd430c8'],
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  favoriteSkills?: string[];

  @ApiPropertyOptional({ enum: UserRole, default: UserRole.USER })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
