import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserGender, UserRole } from './user.enums';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 255, select: false })
  password!: string;

  @Column({ type: 'text', nullable: true })
  about?: string | null;

  @Column({ type: 'date' })
  birthdate!: string;

  @Column({ type: 'varchar', length: 100 })
  city!: string;

  @Column({
    type: 'enum',
    enum: UserGender,
    enumName: 'user_gender_enum',
  })
  gender!: UserGender;

  @Column({ type: 'varchar', length: 500, nullable: true })
  avatar?: string | null;

  @OneToMany('SkillEntity', 'owner')
  skills?: unknown[];

  @ManyToMany('CategoryEntity')
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
  wantToLearn?: unknown[];

  @ManyToMany('SkillEntity')
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
  favoriteSkills?: unknown[];

  @Column({
    type: 'enum',
    enum: UserRole,
    enumName: 'user_role_enum',
    default: UserRole.USER,
  })
  role: UserRole = UserRole.USER;

  @Column({
    name: 'refresh_token',
    type: 'text',
    nullable: true,
  })
  refreshToken?: string | null;
}
