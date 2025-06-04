import { Module } from '@nestjs/common';
import { DeviceService } from './device.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from './entities/device.entity';
import { DeviceController } from './device.controller';
import { Type } from 'class-transformer';
import { Model } from 'src/model/entities/model.entity';
import { Employee } from 'src/employee/entities/employee.entity';
import { Status } from 'src/status/entities/status.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Device, Model, Employee, Status])],
  providers: [DeviceService],
  controllers: [DeviceController],
})
export class DeviceModule {}
