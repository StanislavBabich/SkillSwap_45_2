import { IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RequestStatus } from '../request-status.enums';

export class UpdateRequestDto {
  @ApiProperty({
    description: 'New request status',
    enum: RequestStatus,
    example: RequestStatus.ACCEPTED,
  })
  @IsEnum(RequestStatus)
  @IsOptional()
  status?: RequestStatus;
}
