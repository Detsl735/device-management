import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Device } from './entities/device.entity';
import { In, Not, Repository } from 'typeorm';
import { Model } from 'src/model/entities/model.entity';
import { Employee } from 'src/employee/entities/employee.entity';
import { Status } from 'src/status/entities/status.entity';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';

@Injectable()
export class DeviceService {
  constructor(
    @InjectRepository(Device)
    private readonly deviceRepository: Repository<Device>,
    @InjectRepository(Model)
    private readonly modelRepository: Repository<Model>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(Status)
    private readonly statusRepository: Repository<Status>,
  ) {}

  async create(dto: CreateDeviceDto): Promise<Device> {
    const model = await this.modelRepository.findOneBy({ id: dto.modelId });
    if (!model)
      throw new NotFoundException(`Model with ID ${dto.modelId} not found`);

    const employee = dto.employeeId
      ? await this.employeeRepository.findOneBy({ id: dto.employeeId })
      : null;

    const status = await this.statusRepository.findOneBy({ id: dto.statusId });
    if (!status)
      throw new NotFoundException(`Status with ID ${dto.statusId} not found`);

    const device = this.deviceRepository.create({
      serialNum: dto.serialNum,
      model,
      employee,
      status,
    });

    return this.deviceRepository.save(device);
  }

  async findAll(): Promise<Device[]> {
    return this.deviceRepository.find({
      relations: ['model', 'employee', 'status'],
    });
  }

  async findOne(id: number): Promise<Device> {
    const device = await this.deviceRepository.findOne({
      where: { id, isDeleted: false },
      relations: ['model', 'employee', 'status'],
    });
    if (!device) throw new NotFoundException(`Device with ID ${id} not found`);
    return device;
  }

  async update(id: number, dto: UpdateDeviceDto): Promise<Device> {
    const device = await this.findOne(id);

    if (dto.modelId) {
      const model = await this.modelRepository.findOneBy({ id: dto.modelId });
      if (!model) {
        throw new NotFoundException(`Model with ID ${dto.modelId} not found`);
      }
      device.model = model;
    }

    if (dto.employeeId !== undefined) {
      device.employee = dto.employeeId
        ? await this.employeeRepository.findOneBy({ id: dto.employeeId })
        : null;
    }

    if (dto.serialNum !== undefined) {
      device.serialNum = dto.serialNum;
    }
    return this.deviceRepository.save(device);
  }

  async remove(id: number): Promise<void> {
    const device = await this.findOne(id);
    device.isDeleted = true;
    await this.deviceRepository.save(device);
  }
}
