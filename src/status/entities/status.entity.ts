import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('status')
export class Status {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;
}
