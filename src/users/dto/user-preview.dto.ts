import { ApiProperty } from '@nestjs/swagger';

export class UserPreviewDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty({ nullable: true })
  avatar?: string | null;
}
