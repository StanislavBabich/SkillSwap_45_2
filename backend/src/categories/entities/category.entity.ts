import { Skill } from '../../skills/entities/skill.entity';
import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('categories')
export class Category {
  @ApiProperty({
    description: 'Unique category identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ description: 'Category name', example: 'Programming' })
  @Column({ type: 'varchar', length: 255, unique: true })
  name!: string;

  @ApiPropertyOptional({
    description: 'Parent category',
    type: () => Category,
    nullable: true,
    example: {
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Development',
      createdAt: '2026-07-23T12:00:00.000Z',
      updatedAt: '2026-07-23T12:00:00.000Z',
    },
  })
  @ManyToOne(() => Category, (category) => category.children, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  parent?: Category | null;

  @ApiPropertyOptional({
    description: 'Nested categories',
    type: () => Category,
    isArray: true,
    example: [
      {
        id: '6ba7b810-9dad-41d1-80b4-00c04fd430c8',
        name: 'Backend development',
        createdAt: '2026-07-23T12:00:00.000Z',
        updatedAt: '2026-07-23T12:00:00.000Z',
      },
    ],
  })
  @OneToMany(() => Category, (category) => category.parent)
  children?: Category[];

  @ApiHideProperty()
  @OneToMany(() => Skill, (skill) => skill.category)
  skills?: Skill[];

  @ApiProperty({
    description: 'Category creation timestamp',
    example: '2026-07-23T12:00:00.000Z',
    format: 'date-time',
  })
  @CreateDateColumn()
  createdAt!: Date;

  @ApiProperty({
    description: 'Category last update timestamp',
    example: '2026-07-23T12:00:00.000Z',
    format: 'date-time',
  })
  @UpdateDateColumn()
  updatedAt!: Date;
}
