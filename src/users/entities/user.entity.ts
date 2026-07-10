import { Exclude } from 'class-transformer';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserGender, UserRole } from './user.enums';
import { Skill } from '../../skills/entities/skill.entity';
import {
  Column,
  Entity,
  // JoinTable,
  // ManyToMany,
  // OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserGender, UserRole } from '../user.enums';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Exclude()
  @Column({ type: 'varchar', length: 255, select: false })
  password!: string;

  @Column({ type: 'text', nullable: true })
  about?: string | null;

  @Column({ type: 'date', nullable: true })
  birthdate?: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  city?: string | null;

  @Column({
    type: 'enum',
    enum: UserGender,
    enumName: 'user_gender_enum',
    nullable: true,
  })
  gender?: UserGender | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  avatar?: string | null;

  @OneToMany(() => Skill, (skill) => skill.owner)
  skills?: Skill[];

  @Column({
    type: 'enum',
    enum: UserRole,
    enumName: 'user_role_enum',
    default: UserRole.USER,
  })
  role: UserRole = UserRole.USER;

  @Exclude()
  @Column({
    name: 'refresh_token',
    type: 'text',
    nullable: true,
  })
  refreshToken?: string | null;
}
