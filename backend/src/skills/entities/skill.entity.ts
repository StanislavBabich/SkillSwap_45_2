import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  VirtualColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Request } from '../../requests/entities/request.entity';
import { Category } from '../../categories/entities/category.entity';

@Entity('skills')
export class Skill {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Column({ type: 'text', array: true, nullable: true })
  images?: string[] | null;

  @ManyToOne(() => Category, (category) => category.skills, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'category_id' })
  category!: Category | null;

  @ManyToOne(() => User, (user) => user.skills, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'owner_id' })
  owner!: User;

  @ManyToMany(() => User, (user) => user.favoriteSkills)
  favoritedBy?: User[];

  @VirtualColumn({
    type: 'int',
    query: (alias) =>
      `(SELECT COUNT(*) FROM "users_favorite_skills" "favorites" WHERE "favorites"."skill_id" = ${alias}."id")`,
  })
  favoriteCount?: number;

  // Где этот скилл — предлагаемый
  @OneToMany(() => Request, (request) => request.offeredSkill)
  offeredInRequests!: Request[];

  // Где этот скилл — запрашиваемый
  @OneToMany(() => Request, (request) => request.requestedSkill)
  requestedInRequests!: Request[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
