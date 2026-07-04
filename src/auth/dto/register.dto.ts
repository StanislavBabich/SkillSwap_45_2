import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Некорректный email' })
  @IsNotEmpty({ message: 'Email обязателен' })
  email!: string;

  @IsString()
  @MinLength(6, { message: 'Пароль должен быть минимум 6 символов' })
  @IsNotEmpty({ message: 'Пароль обязателен' })
  password!: string;

  @IsString()
  @IsNotEmpty({ message: 'Имя обязательно' })
  name!: string;
}
