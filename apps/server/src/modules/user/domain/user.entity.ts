import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Auth } from './auth.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  username: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  lastlogin: string;

  @Column('text', { array: true, default: [] })
  auths: string[];

  //컬럼이 아닌 외부 mapping
  authCodes: Auth[];
}
