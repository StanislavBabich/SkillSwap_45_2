import { ApiProperty } from '@nestjs/swagger';
import { UserGender } from '../../users/user.enums';

class SimilarUserSkillDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty({ nullable: true })
  description?: string | null;
}

export class SimilarUserDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty({ nullable: true })
  avatar?: string | null;

  @ApiProperty({ nullable: true })
  city?: string | null;

  @ApiProperty({ nullable: true })
  birthdate?: string | null;

  @ApiProperty({ nullable: true })
  about?: string | null;

  @ApiProperty({ enum: UserGender, nullable: true })
  gender?: UserGender | null;

  @ApiProperty()
  commonSkillsCount!: number;

  @ApiProperty({ type: [SimilarUserSkillDto] })
  skills!: SimilarUserSkillDto[];
}
