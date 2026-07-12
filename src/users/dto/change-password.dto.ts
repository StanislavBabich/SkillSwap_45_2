import { IsString, MinLength, IsNotEmpty } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'Текущий пароль обязателен' })
  oldPassword!: string;

  @IsString()
  @MinLength(6, { message: 'Новый пароль должен быть минимум 6 символов' })
  @IsNotEmpty({ message: 'Новый пароль обязателен' })
  newPassword!: string;
}
