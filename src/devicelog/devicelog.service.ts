import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeviceLog } from './entities/devicelog.entity';

@Injectable()
export class DevicelogService {
  constructor(
    @InjectRepository(DeviceLog)
    private readonly devicelogRepository: Repository<DeviceLog>,
  ) {}

  async findAll(): Promise<DeviceLog[]> {
    return this.devicelogRepository.find({
      relations: ['employee', 'device'],
      order: { date: 'DESC' },
    });
  }

  // // этот метод будет вызываться из других сервисов:
  // async createLog(
  //   deviceId: number,
  //   employeeId: number,
  //   description: string,
  // ): Promise<DeviceLog> {
  //   const log = this.devicelogRepository.create({
  //     device: { id: deviceId },
  //     employee: { id: employeeId },
  //     description,
  //     date: new Date(),
  //   });

  //   return this.devicelogRepository.save(log);
  // }
}
