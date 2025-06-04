import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeService } from './employee.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let repo: Repository<Employee>;

  const mockEmployeeRepository = {
    create: jest.fn((dto) => dto),
    save: jest.fn((employee) => Promise.resolve({ id: 1, ...employee })),
    find: jest.fn(() =>
      Promise.resolve([{ id: 1, email: 'test@example.com' }]),
    ),
    findOneBy: jest.fn(({ id, isDeleted }) =>
      id === 1 && !isDeleted
        ? Promise.resolve({
            id: 1,
            email: 'test@example.com',
            isDeleted: false,
          })
        : Promise.resolve(null),
    ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeeService,
        {
          provide: getRepositoryToken(Employee),
          useValue: mockEmployeeRepository,
        },
      ],
    }).compile();

    service = module.get<EmployeeService>(EmployeeService);
    repo = module.get<Repository<Employee>>(getRepositoryToken(Employee));
  });

  it('должен быть определён', () => {
    expect(service).toBeDefined();
  });

  it('должен создать сотрудника', async () => {
    const dto = {
      email: 'test@example.com',
      floor: '4B',
      role: 'user',
      firstName: 'Ivan',
      lastName: 'Ivanov',
      telegramId: 123456,
      tableNum: '12',
    };

    const result = await service.create(dto);
    expect(repo.create).toHaveBeenCalledWith(dto);
    expect(repo.save).toHaveBeenCalled();
    expect(result).toEqual({ id: 1, ...dto });
  });

  it('должен вернуть всех сотрудников', async () => {
    const result = await service.findAll();
    expect(repo.find).toHaveBeenCalledWith({ where: { isDeleted: false } });
    expect(result.length).toBe(1);
  });

  it('должен вернуть одного сотрудника по ID', async () => {
    const result = await service.findOne(1);
    expect(repo.findOneBy).toHaveBeenCalledWith({ id: 1, isDeleted: false });
    expect(result.id).toBe(1);
  });

  it('должен выбросить ошибку если сотрудник не найден', async () => {
    await expect(service.findOne(2)).rejects.toThrowError(
      `Employee with ID 2 not found`,
    );
  });

  it('должен обновить сотрудника', async () => {
    const dto = { role: 'admin' };
    const result = await service.update(1, dto);
    expect(result).toEqual(expect.objectContaining({ role: 'admin' }));
  });

  it('должен пометить сотрудника как удаленного', async () => {
    await service.remove(1);
    expect(repo.save).toHaveBeenCalledWith(
      expect.objectContaining({ isDeleted: true }),
    );
  });
});
