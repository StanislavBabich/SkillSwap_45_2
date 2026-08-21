import { ApiProperty } from '@nestjs/swagger';
import { RequestStatus } from '../request-status.enums';
import { UserPreviewDto } from '../../users/dto/user-preview.dto';
import { SkillPreviewDto } from '../../skills/dto/skill-preview.dto';

export class RequestResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty({ enum: RequestStatus })
  status!: RequestStatus;

  @ApiProperty()
  isRead!: boolean;

  @ApiProperty({ type: () => UserPreviewDto })
  sender!: UserPreviewDto;

  @ApiProperty({ type: () => UserPreviewDto })
  receiver!: UserPreviewDto;

  @ApiProperty({ type: () => SkillPreviewDto })
  offeredSkill!: SkillPreviewDto;

  @ApiProperty({ type: () => SkillPreviewDto })
  requestedSkill!: SkillPreviewDto;
}
