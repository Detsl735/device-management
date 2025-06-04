import { Test, TestingModule } from '@nestjs/testing';
import { ModelController } from './model.controller';
import { ModelService } from './model.service';
import { CreateModelDto } from './dto/create-model.dto';
import { UpdateModelDto } from './dto/update-model.dto';

describe('ModelController', () => {
  let controller: ModelController;
  let service: ModelService;

  const mockModelService = {
    create: jest.fn((dto) => ({ id: 1, ...dto })),
    findAll: jest.fn(() => [
      { id: 1, name: 'HP EliteBook', typeId: 1 },
      { id: 2, name: 'Lenovo ThinkPad', typeId: 2 },
    ]),
    findOne: jest.fn((id) => ({ id, name: 'Model', typeId: 1 })),
    update: jest.fn((id, dto) => ({ id, ...dto })),
    remove: jest.fn((id) => ({ deleted: true })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ModelController],
      providers: [
        {
          provide: ModelService,
          useValue: mockModelService,
        },
      ],
    }).compile();

    controller = module.get<ModelController>(ModelController);
    service = module.get<ModelService>(ModelService);
  });

  it('должен быть определён', () => {
    expect(controller).toBeDefined();
  });

  it('создаёт модель', async () => {
    const dto: CreateModelDto = {
      name: 'HP EliteBook 840 G8',
      typeId: 1,
      profileIds: [1, 2],
    };

    const result = await controller.create(dto);
    expect(result).toEqual({ id: 1, ...dto });
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('возвращает все модели', async () => {
    const result = await controller.findAll();
    expect(result.length).toBe(2);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('возвращает модель по id', async () => {
    const result = await controller.findOne(1);
    expect(result).toEqual({ id: 1, name: 'Model', typeId: 1 });
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('обновляет модель', async () => {
    const dto: UpdateModelDto = { name: 'Updated Model' };
    const result = await controller.update(1, dto);
    expect(result).toEqual({ id: 1, ...dto });
    expect(service.update).toHaveBeenCalledWith(1, dto);
  });

  it('удаляет модель', async () => {
    const result = await controller.remove(1);
    expect(result).toEqual({ deleted: true });
    expect(service.remove).toHaveBeenCalledWith(1);
  });
});
