import { IsUUID, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRequestDto {
  @ApiProperty({
    description: 'ID пользователя, которому отправляют заявку',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  receiverId!: string;

  @ApiProperty({
    description: 'ID навыка, который предлагает отправитель',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  @IsNotEmpty()
  offeredSkillId!: string;

  @ApiProperty({
    description: 'ID навыка, который хочет получить отправитель',
    example: '123e4567-e89b-12d3-a456-426614174002',
  })
  @IsUUID()
  @IsNotEmpty()
  requestedSkillId!: string;
}
