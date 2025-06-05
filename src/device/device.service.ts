import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { InjectBot } from 'nestjs-telegraf';
import { InjectRepository } from '@nestjs/typeorm';
import { Device } from './entities/device.entity';
import { In, Not, Repository } from 'typeorm';
import { Model } from '../model/entities/model.entity';
import { Employee } from '../employee/entities/employee.entity';
import { Status } from '../status/entities/status.entity';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { DeviceLog } from '../devicelog/entities/devicelog.entity';

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
    @InjectBot() private readonly bot: Telegraf,
    @InjectRepository(DeviceLog)
    private readonly logRepository: Repository<DeviceLog>,
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

  async requestTransfer(deviceId: number, requesterId: number) {
    const requester = await this.employeeRepository.findOneBy({
      id: requesterId,
    });
    const device = await this.deviceRepository.findOne({
      where: { id: deviceId, isDeleted: false },
      relations: ['employee'],
    });

    if (!device) throw new NotFoundException('Устройство не найдено');
    if (!device.employee || !device.employee.telegramId) {
      throw new BadRequestException(
        'Устройство не закреплено за пользователем с Telegram ID',
      );
    }

    const ownerTelegramId = device.employee.telegramId;

    await this.bot.telegram.sendMessage(
      ownerTelegramId,
      `Пользователь #${requester.firstName}  ${requester.lastName}хочет получить доступ к устройству "${device.serialNum}". Одобрить?`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '✅ Одобрить',
                callback_data: `accept_${deviceId}_${requesterId}`,
              },
              {
                text: '❌ Отклонить',
                callback_data: `reject_${deviceId}_${requesterId}`,
              },
            ],
          ],
        },
      },
    );

    return { message: 'Запрос отправлен владельцу устройства' };
  }

  async findByEmployeeId(employeeId: number): Promise<Device[]> {
    return this.deviceRepository.find({
      where: { employee: { id: employeeId }, isDeleted: false },
      relations: ['model', 'status'],
    });
  }

  async releaseDevice(deviceId: number, employeeId: number): Promise<Device> {
    const device = await this.deviceRepository.findOne({
      where: { id: deviceId, isDeleted: false },
      relations: ['employee', 'status'],
    });

    if (!device) {
      throw new NotFoundException(`Device with ID ${deviceId} not found`);
    }

    if (!device.employee || device.employee.id !== employeeId) {
      throw new ForbiddenException('You are not assigned to this device');
    }

    const prevEmployee = device.employee;

    device.employee = null;
    device.status = await this.statusRepository.findOneBy({
      name: 'свободен',
    });

    // логируем освобождение
    await this.logRepository.save({
      action: 'освобождение',
      device: device,
      employee: prevEmployee,
    });

    return this.deviceRepository.save(device);
  }

  async useDevice(deviceId: number, employeeId: number): Promise<Device> {
    const device = await this.deviceRepository.findOne({
      where: { id: deviceId, isDeleted: false },
      relations: ['employee', 'status'],
    });

    if (!device) {
      throw new NotFoundException(`Device with ID ${deviceId} not found`);
    }

    if (device.employee && device.employee.id !== employeeId) {
      throw new ForbiddenException(
        'This device is already assigned to another employee',
      );
    }

    const employee = await this.employeeRepository.findOneBy({
      id: employeeId,
    });

    if (!employee) {
      throw new NotFoundException(`Employee with ID ${employeeId} not found`);
    }

    device.employee = employee;
    device.status = await this.statusRepository.findOneBy({ name: 'занят' });

    // логируем закрепление
    await this.logRepository.save({
      action: 'закрепление',
      device: device,
      employee: employee,
    });

    return this.deviceRepository.save(device);
  }
}
