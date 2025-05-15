import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'calendar' })
export class Calendar {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  content: string;

  @Column({ nullable: true })
  userid: string;

  @Column({ nullable: true })
  scheduleday: string;

  @Column({ nullable: true })
  createdday: string;
}
