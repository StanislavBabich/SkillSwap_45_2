import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ example: 'CurrentPassword123', writeOnly: true })
  @IsString()
  @IsNotEmpty({ message: 'Current password is required' })
  oldPassword!: string;

  @ApiProperty({
    example: 'NewPassword123',
    minLength: 6,
    writeOnly: true,
  })
  @IsString()
  @MinLength(6, { message: 'New password must be at least 6 characters' })
  @IsNotEmpty({ message: 'New password is required' })
  newPassword!: string;
}
