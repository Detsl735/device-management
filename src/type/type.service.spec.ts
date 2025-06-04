import { Test, TestingModule } from '@nestjs/testing';
import { TypeService } from './type.service';
import { Type } from './entities/type.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('TypeService', () => {
  let service: TypeService;
  let repo: jest.Mocked<Repository<Type>>;

  const mockRepo = () => ({
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TypeService,
        {
          provide: getRepositoryToken(Type),
          useFactory: mockRepo,
        },
      ],
    }).compile();

    service = module.get<TypeService>(TypeService);
    repo = module.get(getRepositoryToken(Type));
  });

  it('должен быть определён', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('создаёт и сохраняет тип', async () => {
      const dto = { name: 'Монитор' };
      const created = {
        id: 1,
        name: 'Монитор',
        isDeleted: false,
      };

      repo.create.mockReturnValue(dto as Type);
      repo.save.mockResolvedValue(created);

      const result = await service.create(dto);
      expect(repo.create).toHaveBeenCalledWith(dto);
      expect(repo.save).toHaveBeenCalledWith(dto);
      expect(result).toEqual(created);
    });
  });

  describe('findAll', () => {
    it('возвращает только активные типы', async () => {
      const types = [
        { id: 1, name: 'Монитор', isDeleted: false },
        { id: 2, name: 'Сканер', isDeleted: false },
      ];
      repo.find.mockResolvedValue(types as Type[]);

      const result = await service.findAll();
      expect(repo.find).toHaveBeenCalledWith({ where: { isDeleted: false } });
      expect(result).toEqual(types);
    });
  });

  describe('findOne', () => {
    it('возвращает тип по id', async () => {
      const type = { id: 1, name: 'Принтер', isDeleted: false } as Type;
      repo.findOneBy.mockResolvedValue(type);

      const result = await service.findOne(1);
      expect(result).toEqual(type);
      expect(repo.findOneBy).toHaveBeenCalledWith({ id: 1, isDeleted: false });
    });

    it('выбрасывает NotFound, если тип не найден', async () => {
      repo.findOneBy.mockResolvedValue(null);
      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('обновляет и сохраняет тип', async () => {
      const type = { id: 1, name: 'Old', isDeleted: false } as Type;
      const dto = { name: 'New' };
      repo.findOneBy.mockResolvedValue(type);
      repo.save.mockResolvedValue({ ...type, ...dto });

      const result = await service.update(1, dto);
      expect(result).toEqual({ ...type, ...dto });
    });
  });

  describe('remove', () => {
    it('мягко удаляет тип', async () => {
      const type = { id: 1, name: 'Удаляемый', isDeleted: false } as Type;
      repo.findOneBy.mockResolvedValue(type);

      await service.remove(1);

      expect(type.isDeleted).toBe(true);
      expect(repo.save).toHaveBeenCalledWith(type);
    });
  });
});
