import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Skill } from '../../skills/entities/skill.entity';
import { RequestStatus } from '../request-status.enums';

@Entity('requests')
export class Request {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @CreateDateColumn()
  createdAt!: Date;

  // Связь с отправителем
  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'sender_id' })
  sender!: User;

  // Связь с получателем
  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'receiver_id' })
  receiver!: User;

  @Column({
    type: 'enum',
    enum: RequestStatus,
    enumName: 'request_status_enum',
    default: RequestStatus.PENDING,
  })
  status!: RequestStatus;

  // Связь с предлагаемым навыком
  @ManyToOne(() => Skill, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'offered_skill_id' })
  offeredSkill!: Skill;

  // Связь с запрашиваемым навыком
  @ManyToOne(() => Skill, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'requested_skill_id' })
  requestedSkill!: Skill;

  @Column({ default: false })
  isRead!: boolean;
}
