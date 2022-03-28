import {
  AfterInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class UserGoals {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  icon: string;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'double' })
  totalAmount: number;

  @Column({ type: 'double' })
  savedAmount: number;

  @Column({ type: 'double' })
  pendingAmount: number;

  @Column({ type: 'double' })
  percentageCompleted: number;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;

  @AfterInsert()
  updateAmount() {
    this.pendingAmount = this.totalAmount - this.savedAmount;
    this.percentageCompleted = (this.savedAmount / this.totalAmount) * 100;
  }
}
