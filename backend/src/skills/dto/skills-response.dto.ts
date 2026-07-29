import { ApiProperty } from '@nestjs/swagger';
import { SkillResponseDto } from './skill-response.dto';

export class SkillsResponseDto {
  @ApiProperty({ type: [SkillResponseDto] })
  data: SkillResponseDto[] = [];

  @ApiProperty({ example: 1, minimum: 1 })
  page: number = 1;

  @ApiProperty({ example: 3, minimum: 0 })
  totalPages: number = 0;
}
