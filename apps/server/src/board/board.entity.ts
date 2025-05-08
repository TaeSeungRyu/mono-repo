import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'board' })
export class Board {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  content: string;

  @Column({ nullable: true })
  userid: string;

  @Column({ nullable: true })
  createdday: string;
}
