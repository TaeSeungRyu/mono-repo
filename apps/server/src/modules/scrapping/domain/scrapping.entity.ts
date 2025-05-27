import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'scrapping' })
export class Scrapping {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  contents: string;

  @Column({ nullable: true })
  createdday: string;
}
