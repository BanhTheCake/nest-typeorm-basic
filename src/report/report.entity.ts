import { User } from '../user/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  model: string;

  @Column()
  make: string;

  @Column()
  lat: number;

  @Column()
  lng: number;

  @Column()
  price: number;

  @Column()
  year: number;

  @Column({ default: false })
  approve: boolean;

  @ManyToOne(() => User, (user) => user.reports, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ name: 'userId' })
  userId: number;
}
