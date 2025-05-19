import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Auth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  authcode: string;

  @Column()
  authname: string;

  @Column({ nullable: true })
  createdday: string;
}
