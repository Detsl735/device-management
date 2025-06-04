import { Test, TestingModule } from '@nestjs/testing';
import { FeatureController } from './feature.controller';
import { FeatureService } from './feature.service';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { UpdateFeatureDto } from './dto/update-feature.dto';

describe('FeatureController', () => {
  let controller: FeatureController;
  let service: FeatureService;

  const mockFeatureService = {
    create: jest.fn((dto) => ({ id: 1, ...dto })),
    findAll: jest.fn(() => [
      { id: 1, name: 'Фича 1', variableName: 'feature1' },
    ]),
    findOne: jest.fn((id) => ({ id, name: 'Фича', variableName: 'feature' })),
    update: jest.fn((id, dto) => ({ id, ...dto })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeatureController],
      providers: [
        {
          provide: FeatureService,
          useValue: mockFeatureService,
        },
      ],
    }).compile();

    controller = module.get<FeatureController>(FeatureController);
    service = module.get<FeatureService>(FeatureService);
  });

  it('должен быть определён', () => {
    expect(controller).toBeDefined();
  });

  it('создает фичу', async () => {
    const dto: CreateFeatureDto = {
      name: 'Печать',
      variableName: 'canPrint',
      profileIds: [1],
    };
    const result = await controller.create(dto);
    expect(service.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ id: 1, ...dto });
  });

  it('возвращает все фичи', async () => {
    const result = await controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
    expect(result.length).toBe(1);
  });

  it('возвращает одну фичу', async () => {
    const result = await controller.findOne(1);
    expect(service.findOne).toHaveBeenCalledWith(1);
    expect(result).toEqual({ id: 1, name: 'Фича', variableName: 'feature' });
  });

  it('обновляет фичу', async () => {
    const dto: UpdateFeatureDto = { name: 'Обновлённая фича' };
    const result = await controller.update(1, dto);
    expect(service.update).toHaveBeenCalledWith(1, dto);
    expect(result).toEqual({ id: 1, ...dto });
  });
});
