import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

describe('EmployeeController', () => {
  let controller: EmployeeController;
  let service: EmployeeService;

  const mockEmployeeService = {
    create: jest.fn((dto) => ({
      id: 1,
      ...dto,
    })),
    findAll: jest.fn(() => [
      { id: 1, email: 'test@example.com' },
      { id: 2, email: 'second@example.com' },
    ]),
    findOne: jest.fn((id) => ({ id, email: 'test@example.com' })),
    update: jest.fn((id, dto) => ({ id, ...dto })),
    remove: jest.fn((id) => ({ deleted: true })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeController],
      providers: [
        {
          provide: EmployeeService,
          useValue: mockEmployeeService,
        },
      ],
    }).compile();

    controller = module.get<EmployeeController>(EmployeeController);
    service = module.get<EmployeeService>(EmployeeService);
  });

  it('должен быть определён', () => {
    expect(controller).toBeDefined();
  });

  it('должен создать сотрудника', async () => {
    const dto: CreateEmployeeDto = {
      email: 'test@example.com',
      floor: '2A',
      role: 'user',
      firstName: 'Ivan',
      lastName: 'Ivanov',
      tableNum: '34',
      telegramId: 123456,
    };
    const result = await controller.create(dto);
    expect(result).toEqual({ id: 1, ...dto });
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('должен вернуть список сотрудников', async () => {
    const result = await controller.findAll();
    expect(result.length).toBe(2);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('должен вернуть одного сотрудника по ID', async () => {
    const result = await controller.findOne(1);
    expect(result).toEqual({ id: 1, email: 'test@example.com' });
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('должен обновить данные сотрудника', async () => {
    const dto: UpdateEmployeeDto = {
      floor: '3B',
    };
    const result = await controller.update(1, dto);
    expect(result).toEqual({ id: 1, ...dto });
    expect(service.update).toHaveBeenCalledWith(1, dto);
  });

  it('должен удалить сотрудника', async () => {
    const result = await controller.remove(1);
    expect(result).toEqual({ deleted: true });
    expect(service.remove).toHaveBeenCalledWith(1);
  });
});
