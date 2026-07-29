import { ApiProperty } from '@nestjs/swagger';
import { UserGender } from '../../users/user.enums';

class SimilarUserSkillDto {
  @ApiProperty({
    example: '6ba7b810-9dad-41d1-80b4-00c04fd430c8',
    format: 'uuid',
  })
  id!: string;

  @ApiProperty({ example: 'NestJS development' })
  title!: string;

  @ApiProperty({ example: 'Backend development', nullable: true })
  description?: string | null;
}

export class SimilarUserDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  id!: string;

  @ApiProperty({ example: 'Alex Smith' })
  name!: string;

  @ApiProperty({ example: 'alex@example.com', format: 'email' })
  email!: string;

  @ApiProperty({ example: 'https://example.com/avatar.jpg', nullable: true })
  avatar?: string | null;

  @ApiProperty({ example: 'Moscow', nullable: true })
  city?: string | null;

  @ApiProperty({ example: '1995-05-20', format: 'date', nullable: true })
  birthdate?: string | null;

  @ApiProperty({ example: 'Backend developer', nullable: true })
  about?: string | null;

  @ApiProperty({ enum: UserGender, nullable: true })
  gender?: UserGender | null;

  @ApiProperty({ example: 2, minimum: 1 })
  commonSkillsCount!: number;

  @ApiProperty({ type: SimilarUserSkillDto, isArray: true })
  skills!: SimilarUserSkillDto[];
}
