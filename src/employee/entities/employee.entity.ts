import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  email: string;

  @Column({ length: 50 })
  floor: string;

  @Column({ length: 20 })
  role: string;

  @Column({ length: 100 })
  firstName: string;

  @Column({ length: 100 })
  lastName: string;

  @Column('bigint', { nullable: true })
  telegramId: number;

  @Column({ length: 10 })
  tableNum: string;

  @Column({ default: false })
  isDeleted: boolean;
}
