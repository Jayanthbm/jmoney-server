import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { CategoryEnum } from '../enum/enums';

@Entity()
export class UserTransactions {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'double' })
  amount: number;

  @Column({ type: 'varchar' })
  date: string;

  @Column({ type: 'set', enum: CategoryEnum })
  type: CategoryEnum;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;
}
