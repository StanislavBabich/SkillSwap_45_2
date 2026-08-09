import { Transform } from 'class-transformer';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindCitiesQueryDto {
  @ApiPropertyOptional({
    description: 'Case-insensitive substring to search for in city names',
    example: 'моск',
  })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsOptional()
  @IsString()
  @MaxLength(255)
  search?: string;
}
