import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('type')
export class Type {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ default: false })
  isDeleted: boolean;
}
