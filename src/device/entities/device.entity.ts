import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Model } from 'src/model/entities/model.entity';
import { Employee } from 'src/employee/entities/employee.entity';
import { Status } from 'src/status/entities/status.entity';

@Entity('device')
export class Device {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 30 })
  serialNum: string;

  @ManyToOne(() => Model, { nullable: false })
  model: Model;

  @ManyToOne(() => Employee, { nullable: true })
  employee: Employee;

  @ManyToOne(() => Status, { nullable: false })
  status: Status;

  @Column({ default: false })
  isDeleted: boolean;
}
