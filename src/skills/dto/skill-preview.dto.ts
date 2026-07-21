import { ApiProperty } from '@nestjs/swagger';

export class SkillPreviewDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty({ nullable: true })
  description?: string | null;
}
