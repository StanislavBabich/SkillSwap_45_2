import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
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
}
