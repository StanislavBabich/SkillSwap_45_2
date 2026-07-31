import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('cities')
export class City {
  @ApiProperty({
    description: 'Unique city identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ description: 'City name', example: 'Moscow' })
  @Column({ type: 'varchar', length: 255, unique: true })
  name!: string;

  @ApiProperty({
    description: 'City creation timestamp',
    example: '2026-07-31T12:00:00.000Z',
    format: 'date-time',
  })
  @CreateDateColumn()
  createdAt!: Date;

  @ApiProperty({
    description: 'City last update timestamp',
    example: '2026-07-31T12:00:00.000Z',
    format: 'date-time',
  })
  @UpdateDateColumn()
  updatedAt!: Date;
}
