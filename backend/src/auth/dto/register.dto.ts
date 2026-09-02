import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsNotEmpty,
} from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Invalid email' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  @MaxLength(20, { message: 'Password must not exceed 20 characters' })
  @IsNotEmpty({ message: 'Password is required' })
  password!: string;

  @IsString()
  @MinLength(2, { message: 'Name must contain at least 2 characters' })
  @MaxLength(50, { message: 'Name must not exceed 50 characters' })
  @IsNotEmpty({ message: 'Name is required' })
  name!: string;
}
