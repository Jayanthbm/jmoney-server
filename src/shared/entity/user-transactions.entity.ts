import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

import { Category } from './category.entity';
import { CategoryEnum } from '../enum/enums';
import { User } from './user.entity';

@Entity()
@Index(['amount', 'date', 'type', 'user', 'category'], { unique: true })
export class UserTransactions {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'double' })
  amount: number;

  @Column({ type: 'timestamp' })
  date: string;

  @Column({ type: 'set', enum: CategoryEnum })
  type: CategoryEnum;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.transactions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Category, (cat) => cat.transactions, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  category: Category;
}
