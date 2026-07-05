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
import { UserGender, UserRole } from '../entities/user.enums';

export class CreateUserDto {
  @IsString()
  @Length(2, 100)
  name!: string;

  @IsEmail()
  @MaxLength(255)
  email!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(255)
  password!: string;

  @IsOptional()
  @IsString()
  @Length(0, 1000)
  about?: string;

  @IsOptional() // ← делаем опциональным
  @IsDateString()
  birthdate?: string;

  @IsOptional() // ← делаем опциональным
  @IsString()
  @Length(2, 100)
  city?: string;

  @IsOptional() // ← делаем опциональным
  @IsEnum(UserGender)
  gender?: UserGender;

  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  avatar?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  wantToLearn?: string[];

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  favoriteSkills?: string[];

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
