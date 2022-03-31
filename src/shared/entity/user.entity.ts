import * as bcrypt from 'bcrypt';

import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Category } from './category.entity';
import { UserGoals } from './user-goals.entity';
import { UserTransactions } from './user-transactions.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ nullable: true, unique: true })
  email: string;

  @Column({ nullable: false, unique: true })
  phone: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  salt: string;

  @Column({ type: 'text', nullable: true })
  image: string;

  @Column({ nullable: true, default: 'INR' })
  currency: string;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt);
    return hash === this.password;
  }
  @BeforeInsert()
  updateImage() {
    const number = Math.floor(Math.random() * 9);
    this.image = `https://randomuser.me/api/portraits/lego/${number}.jpg`;
  }

  @OneToMany(() => UserGoals, (goal) => goal.user)
  goals: UserGoals;

  @OneToMany(() => Category, (cat) => cat.user)
  category: Category;

  @OneToMany(() => UserTransactions, (transaction) => transaction.user)
  transactions: UserTransactions;
}
