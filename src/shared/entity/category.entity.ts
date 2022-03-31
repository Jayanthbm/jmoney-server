import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

import { CategoryEnum } from '../enum/enums';
import { User } from './user.entity';
import { UserTransactions } from './user-transactions.entity';
@Entity()
@Index(['name', 'type', 'user'], { unique: true })
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', nullable: true, default: null, select: false })
  icon: string;

  @Column({ type: 'set', enum: CategoryEnum })
  type: CategoryEnum;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.category, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;

  @OneToMany(() => UserTransactions, (transaction) => transaction.category)
  transactions: UserTransactions;
}
