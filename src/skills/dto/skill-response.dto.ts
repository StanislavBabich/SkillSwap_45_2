import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserPreviewDto } from '../../users/dto/user-preview.dto';

class SkillCategoryDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  id!: string;

  @ApiProperty({ example: 'Backend development' })
  name!: string;
}

export class SkillResponseDto {
  @ApiProperty({
    example: '6ba7b810-9dad-41d1-80b4-00c04fd430c8',
    format: 'uuid',
  })
  id!: string;

  @ApiProperty({ example: 'NestJS development' })
  title!: string;

  @ApiPropertyOptional({
    example: 'I can teach backend development with NestJS',
    nullable: true,
  })
  description?: string | null;

  @ApiPropertyOptional({
    type: [String],
    example: ['/uploads/skill-example.png'],
    nullable: true,
  })
  images?: string[] | null;

  @ApiPropertyOptional({
    type: SkillCategoryDto,
    nullable: true,
  })
  category?: SkillCategoryDto | null;

  @ApiProperty({ type: UserPreviewDto })
  owner!: UserPreviewDto;

  @ApiProperty({
    example: '2026-07-23T12:00:00.000Z',
    format: 'date-time',
  })
  createdAt!: Date;

  @ApiProperty({
    example: '2026-07-23T12:00:00.000Z',
    format: 'date-time',
  })
  updatedAt!: Date;
}
