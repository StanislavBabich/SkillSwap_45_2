import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ example: 'CurrentPassword123', writeOnly: true })
  @IsString()
  @IsNotEmpty({ message: 'Текущий пароль обязателен' })
  oldPassword!: string;

  @ApiProperty({
    example: 'NewPassword123',
    minLength: 6,
    writeOnly: true,
  })
  @IsString()
  @MinLength(6, { message: 'Новый пароль должен быть минимум 6 символов' })
  @IsNotEmpty({ message: 'Новый пароль обязателен' })
  newPassword!: string;
}
