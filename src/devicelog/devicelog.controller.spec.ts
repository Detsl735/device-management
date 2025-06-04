import { Test, TestingModule } from '@nestjs/testing';
import { DevicelogController } from './devicelog.controller';
import { DevicelogService } from './devicelog.service';

describe('DevicelogController', () => {
  let controller: DevicelogController;
  let service: DevicelogService;

  const mockService = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DevicelogController],
      providers: [
        {
          provide: DevicelogService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get(DevicelogController);
    service = module.get(DevicelogService);
  });

  it('должен быть определён', () => {
    expect(controller).toBeDefined();
  });

  it('возвращает все логи', async () => {
    const logs = [{ id: 1, action: 'UPDATED' }];
    mockService.findAll.mockResolvedValue(logs);

    const result = await controller.findAll();
    expect(result).toEqual(logs);
    expect(service.findAll).toHaveBeenCalled();
  });
});
