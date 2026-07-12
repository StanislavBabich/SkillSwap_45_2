import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Skill } from '../../skills/entities/skill.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  // Связь с родительской категорией
  @ManyToOne(() => Category, (category) => category.children, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parent_id' })
  parent!: Category | null;

  // Связь с дочерними категориями (подкатегории)
  @OneToMany(() => Category, (category) => category.parent)
  children!: Category[];

  // связь со скилами
  @OneToMany(() => Skill, (skill) => skill.category)
  skills!: Skill[];
}
