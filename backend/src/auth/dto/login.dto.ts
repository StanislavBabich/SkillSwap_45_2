import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Invalid email' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must contain at least 6 characters' })
  @MaxLength(20, { message: 'Password must not exceed 20 characters' })
  password: string;
}
