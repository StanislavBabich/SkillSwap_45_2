import { Exclude } from 'class-transformer';
import {
  ApiHideProperty,
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Skill } from '../../skills/entities/skill.entity';
import { Category } from '../../categories/entities/category.entity';
import { Request } from '../../requests/entities/request.entity';
import { UserGender, UserRole } from '../user.enums';

@Entity('users')
export class User {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ApiProperty({ example: 'Alex Smith' })
  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @ApiProperty({ example: 'alex@example.com', format: 'email' })
  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @ApiHideProperty()
  @Exclude()
  @Column({ type: 'varchar', length: 255, select: false })
  password!: string;

  @ApiPropertyOptional({ example: 'Backend developer', nullable: true })
  @Column({ type: 'text', nullable: true })
  about?: string | null;

  @ApiPropertyOptional({
    example: '1995-05-20',
    format: 'date',
    nullable: true,
  })
  @Column({ type: 'date', nullable: true })
  birthdate?: string | null;

  @ApiPropertyOptional({ example: 'Moscow', nullable: true })
  @Column({ type: 'varchar', length: 100, nullable: true })
  city?: string | null;

  @ApiPropertyOptional({ enum: UserGender, nullable: true })
  @Column({
    type: 'enum',
    enum: UserGender,
    enumName: 'user_gender_enum',
    nullable: true,
  })
  gender?: UserGender | null;

  @ApiPropertyOptional({
    example: 'https://example.com/avatar.jpg',
    format: 'uri',
    nullable: true,
  })
  @Column({ type: 'varchar', length: 500, nullable: true })
  avatar?: string | null;

  @ApiHideProperty()
  @OneToMany(() => Skill, (skill) => skill.owner)
  skills?: Skill[];

  @ApiPropertyOptional({
    description: 'Categories the user wants to learn',
  })
  @ManyToMany(() => Category)
  @JoinTable({
    name: 'users_want_to_learn',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'category_id',
      referencedColumnName: 'id',
    },
  })
  wantToLearn!: Category[];

  @ApiHideProperty()
  @OneToMany(() => Request, (request) => request.sender)
  sentRequests!: Request[];

  @ApiHideProperty()
  @OneToMany(() => Request, (request) => request.receiver)
  receivedRequests!: Request[];

  @ApiHideProperty()
  @ManyToMany(() => Skill, (skill) => skill.favoritedBy)
  @JoinTable({
    name: 'users_favorite_skills',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'skill_id',
      referencedColumnName: 'id',
    },
  })
  favoriteSkills!: Skill[];

  @ApiProperty({ enum: UserRole, default: UserRole.USER })
  @Column({
    type: 'enum',
    enum: UserRole,
    enumName: 'user_role_enum',
    default: UserRole.USER,
  })
  role: UserRole = UserRole.USER;

  @ApiHideProperty()
  @Exclude()
  @Column({
    name: 'refresh_token',
    type: 'text',
    nullable: true,
  })
  refreshToken?: string | null;
}
