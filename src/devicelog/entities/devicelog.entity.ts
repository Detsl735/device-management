import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Device } from 'src/device/entities/device.entity';
import { Employee } from 'src/employee/entities/employee.entity';

@Entity('devicelog')
export class DeviceLog {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  date: Date;

  @Column()
  action: string;

  @ManyToOne(() => Device, { nullable: false })
  device: Device;

  @ManyToOne(() => Employee, { nullable: false })
  employee: Employee;
}
