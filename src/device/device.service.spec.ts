import { Test, TestingModule } from '@nestjs/testing';
import { DeviceService } from './device.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Device } from './entities/device.entity';
import { Model } from '../model/entities/model.entity';
import { Employee } from '../employee/entities/employee.entity';
import { Status } from '../status/entities/status.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

const mockDeviceRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  findOneBy: jest.fn(),
});

const mockModelRepository = () => ({
  findOneBy: jest.fn(),
});

const mockEmployeeRepository = () => ({
  findOneBy: jest.fn(),
});

const mockStatusRepository = () => ({
  findOneBy: jest.fn(),
});

describe('DeviceService', () => {
  let service: DeviceService;
  let deviceRepo: jest.Mocked<Repository<Device>>;
  let modelRepo: jest.Mocked<Repository<Model>>;
  let employeeRepo: jest.Mocked<Repository<Employee>>;
  let statusRepo: jest.Mocked<Repository<Status>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeviceService,
        {
          provide: getRepositoryToken(Device),
          useFactory: mockDeviceRepository,
        },
        { provide: getRepositoryToken(Model), useFactory: mockModelRepository },
        {
          provide: getRepositoryToken(Employee),
          useFactory: mockEmployeeRepository,
        },
        {
          provide: getRepositoryToken(Status),
          useFactory: mockStatusRepository,
        },
      ],
    }).compile();

    service = module.get<DeviceService>(DeviceService);
    deviceRepo = module.get(getRepositoryToken(Device));
    modelRepo = module.get(getRepositoryToken(Model));
    employeeRepo = module.get(getRepositoryToken(Employee));
    statusRepo = module.get(getRepositoryToken(Status));
  });

  it('сервис должен быть определён', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('должен выбросить NotFoundException, если модель не найдена', async () => {
      modelRepo.findOneBy.mockResolvedValue(null);

      await expect(
        service.create({ serialNum: 'SN123', modelId: 1, statusId: 1 }),
      ).rejects.toThrow(NotFoundException);
    });

    it('должен создать и сохранить устройство', async () => {
      modelRepo.findOneBy.mockResolvedValue({ id: 1 } as Model);
      statusRepo.findOneBy.mockResolvedValue({ id: 1 } as Status);
      deviceRepo.create.mockReturnValue({ serialNum: 'SN123' } as Device);
      deviceRepo.save.mockResolvedValue({
        id: 1,
        serialNum: 'SN123',
      } as Device);

      const result = await service.create({
        serialNum: 'SN123',
        modelId: 1,
        statusId: 1,
      });
      expect(result).toEqual({ id: 1, serialNum: 'SN123' });
    });
  });

  describe('findAll', () => {
    it('должен вернуть все устройства', async () => {
      const devices = [{ id: 1 }, { id: 2 }] as Device[];
      deviceRepo.find.mockResolvedValue(devices);
      const result = await service.findAll();
      expect(result).toEqual(devices);
    });
  });

  describe('findOne', () => {
    it('должен вернуть устройство по ID', async () => {
      const device = { id: 1 } as Device;
      deviceRepo.findOne.mockResolvedValue(device);
      const result = await service.findOne(1);
      expect(result).toEqual(device);
    });

    it('должен выбросить NotFoundException, если устройство не найдено', async () => {
      deviceRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('должен установить флаг isDeleted в true', async () => {
      const device = { id: 1, isDeleted: false } as Device;
      jest.spyOn(service, 'findOne').mockResolvedValue(device);
      deviceRepo.save.mockResolvedValue({ ...device, isDeleted: true });

      await service.remove(1);

      expect(device.isDeleted).toBe(true);
    });
  });
});
