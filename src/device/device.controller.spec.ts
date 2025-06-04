import { Test, TestingModule } from '@nestjs/testing';
import { DeviceController } from './device.controller';
import { DeviceService } from './device.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';

describe('DeviceController', () => {
  let controller: DeviceController;
  let service: DeviceService;

  const mockDeviceService = {
    create: jest.fn((dto) => ({ id: 1, ...dto })),
    findAll: jest.fn(() => [
      { id: 1, serialNum: 'ABC123', modelId: 1, statusId: 1 },
    ]),
    findOne: jest.fn((id) => ({
      id,
      serialNum: 'XYZ999',
      modelId: 2,
      statusId: 3,
    })),
    update: jest.fn((id, dto) => ({ id, ...dto })),
    remove: jest.fn((id) => ({ deleted: true })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeviceController],
      providers: [
        {
          provide: DeviceService,
          useValue: mockDeviceService,
        },
      ],
    }).compile();

    controller = module.get<DeviceController>(DeviceController);
    service = module.get<DeviceService>(DeviceService);
  });

  it('должен быть создан', () => {
    expect(controller).toBeDefined();
  });

  it('создаёт устройство', () => {
    const dto: CreateDeviceDto = {
      serialNum: 'XYZ999',
      modelId: 1,
      statusId: 3,
      employeeId: 10,
    };
    expect(controller.create(dto)).toEqual({ id: 1, ...dto });
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('возвращает все устройства', () => {
    expect(controller.findAll()).toEqual([
      { id: 1, serialNum: 'ABC123', modelId: 1, statusId: 1 },
    ]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('возвращает одно устройство по id', () => {
    expect(controller.findOne(42)).toEqual({
      id: 42,
      serialNum: 'XYZ999',
      modelId: 2,
      statusId: 3,
    });
    expect(service.findOne).toHaveBeenCalledWith(42);
  });

  it('обновляет устройство', () => {
    const updateDto: UpdateDeviceDto = {
      statusId: 4,
    };
    expect(controller.update(1, updateDto)).toEqual({ id: 1, ...updateDto });
    expect(service.update).toHaveBeenCalledWith(1, updateDto);
  });

  it('удаляет устройство', () => {
    expect(controller.remove(1)).toEqual({ deleted: true });
    expect(service.remove).toHaveBeenCalledWith(1);
  });
});
