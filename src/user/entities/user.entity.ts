import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { userRole } from '../models/user.role';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: userRole, default: userRole.USER })
  role: string;

  @BeforeInsert()
  emailToLowercase() {
    this.email = this.email.toLowerCase();
  }
}
