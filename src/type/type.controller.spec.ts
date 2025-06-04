import { Test, TestingModule } from '@nestjs/testing';
import { TypeController } from './type.controller';
import { TypeService } from './type.service';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';

describe('TypeController', () => {
  let controller: TypeController;
  let service: TypeService;

  const mockService = {
    create: jest.fn((dto) => ({ id: 1, ...dto })),
    findAll: jest.fn(() => [
      { id: 1, name: 'Монитор' },
      { id: 2, name: 'Принтер' },
    ]),
    findOne: jest.fn((id) => ({ id, name: 'Монитор' })),
    update: jest.fn((id, dto) => ({ id, ...dto })),
    remove: jest.fn((id) => ({ deleted: true })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TypeController],
      providers: [
        {
          provide: TypeService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<TypeController>(TypeController);
    service = module.get<TypeService>(TypeService);
  });

  it('должен быть определён', () => {
    expect(controller).toBeDefined();
  });

  it('создаёт тип', async () => {
    const dto: CreateTypeDto = { name: 'Монитор' };
    const result = await controller.create(dto);
    expect(service.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ id: 1, name: 'Монитор' });
  });

  it('возвращает список типов', async () => {
    const result = await controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
    expect(result).toHaveLength(2);
  });

  it('возвращает один тип по id', async () => {
    const result = await controller.findOne(1);
    expect(service.findOne).toHaveBeenCalledWith(1);
    expect(result).toEqual({ id: 1, name: 'Монитор' });
  });

  it('обновляет тип', async () => {
    const dto: UpdateTypeDto = { name: 'Обновлённый тип' };
    const result = await controller.update(1, dto);
    expect(service.update).toHaveBeenCalledWith(1, dto);
    expect(result).toEqual({ id: 1, name: 'Обновлённый тип' });
  });

  it('удаляет тип', async () => {
    const result = await controller.remove(1);
    expect(service.remove).toHaveBeenCalledWith(1);
    expect(result).toEqual({ deleted: true });
  });
});
