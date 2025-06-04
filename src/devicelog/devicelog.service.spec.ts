import { Test, TestingModule } from '@nestjs/testing';
import { DevicelogService } from './devicelog.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeviceLog } from './entities/devicelog.entity';
import { Repository } from 'typeorm';

describe('DevicelogService', () => {
  let service: DevicelogService;
  let repo: jest.Mocked<Repository<DeviceLog>>;

  const mockRepo = () => ({
    find: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DevicelogService,
        {
          provide: getRepositoryToken(DeviceLog),
          useFactory: mockRepo,
        },
      ],
    }).compile();

    service = module.get(DevicelogService);
    repo = module.get(getRepositoryToken(DeviceLog));
  });

  it('должен быть определён', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('возвращает список логов', async () => {
      const logs = [
        {
          id: 1,
          date: new Date(),
          action: 'CREATED',
          device: { id: 1 },
          employee: { id: 2 },
        },
      ] as DeviceLog[];

      repo.find.mockResolvedValue(logs);

      const result = await service.findAll();
      expect(result).toEqual(logs);
      expect(repo.find).toHaveBeenCalledWith({
        relations: expect.arrayContaining(['device', 'employee']),
        order: { date: 'DESC' },
      });
    });
  });
});
