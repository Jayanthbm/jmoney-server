import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Index,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

import { User } from './user.entity';

@Entity()
@Index(['name', 'totalAmount', 'user'], { unique: true })
export class UserGoals {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  description: string;

  @Column({ type: 'double' })
  totalAmount: number;

  @Column({ type: 'double' })
  savedAmount: number;

  @Column({ type: 'double', nullable: true, default: 0 })
  pendingAmount: number;

  @Column({ type: 'double', nullable: true, default: 0 })
  percentageCompleted: number;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;

  @BeforeInsert()
  updateAmount() {
    this.pendingAmount = this.totalAmount - this.savedAmount;
    this.percentageCompleted = parseFloat(
      ((this.savedAmount / this.totalAmount) * 100).toFixed(2),
    );
  }

  @BeforeUpdate()
  updateAmountAfterUpdate() {
    this.pendingAmount = this.totalAmount - this.savedAmount;
    this.percentageCompleted = parseFloat(
      ((this.savedAmount / this.totalAmount) * 100).toFixed(2),
    );
  }

  @ManyToOne(() => User, (user) => user.goals, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;
}
