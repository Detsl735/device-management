import { Test, TestingModule } from '@nestjs/testing';
import { ModelService } from './model.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Model } from './entities/model.entity';
import { Type } from '../type/entities/type.entity';
import { Profile } from '../profile/entities/profile.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('ModelService', () => {
  let service: ModelService;
  let modelRepo: jest.Mocked<Repository<Model>>;
  let typeRepo: jest.Mocked<Repository<Type>>;
  let profileRepo: jest.Mocked<Repository<Profile>>;

  const mockModelRepo = () => ({
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
  });

  const mockTypeRepo = () => ({
    findOneBy: jest.fn(),
  });

  const mockProfileRepo = () => ({
    findBy: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ModelService,
        { provide: getRepositoryToken(Model), useFactory: mockModelRepo },
        { provide: getRepositoryToken(Type), useFactory: mockTypeRepo },
        { provide: getRepositoryToken(Profile), useFactory: mockProfileRepo },
      ],
    }).compile();

    service = module.get<ModelService>(ModelService);
    modelRepo = module.get(getRepositoryToken(Model));
    typeRepo = module.get(getRepositoryToken(Type));
    profileRepo = module.get(getRepositoryToken(Profile));
  });

  it('должен быть определён', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('должен выбросить ошибку, если тип не найден', async () => {
      typeRepo.findOneBy.mockResolvedValue(null);

      await expect(
        service.create({ name: 'Test', typeId: 999 }),
      ).rejects.toThrowError('Type with ID 999 not found');
    });

    it('создаёт и сохраняет модель', async () => {
      const dto = { name: 'New Model', typeId: 1, profileIds: [1, 2] };
      const type = { id: 1, name: 'Laptop' } as Type;
      const profiles = [{ id: 1 }, { id: 2 }] as Profile[];

      typeRepo.findOneBy.mockResolvedValue(type);
      profileRepo.findBy.mockResolvedValue(profiles);

      const createdModel = {
        id: 1,
        name: dto.name,
        type,
        profiles,
        isDeleted: false,
      } as Model;

      modelRepo.create.mockReturnValue(createdModel);
      modelRepo.save.mockResolvedValue({ id: 1, ...createdModel });

      const result = await service.create(dto);

      expect(result).toEqual({ id: 1, ...createdModel });
      expect(modelRepo.create).toHaveBeenCalledWith({
        name: dto.name,
        type,
        profiles,
      });
    });
  });

  describe('findAll', () => {
    it('возвращает все модели', async () => {
      const models = [{ id: 1, name: 'A', isDeleted: false }] as Model[];
      modelRepo.find.mockResolvedValue(models);

      const result = await service.findAll();
      expect(result).toEqual(models);
      expect(modelRepo.find).toHaveBeenCalledWith({
        where: { isDeleted: false },
        relations: ['type', 'profiles'],
      });
    });
  });

  describe('findOne', () => {
    it('возвращает модель по ID', async () => {
      const model = { id: 1, name: 'Test', isDeleted: false } as Model;
      modelRepo.findOne.mockResolvedValue(model);

      const result = await service.findOne(1);
      expect(result).toEqual(model);
    });

    it('выбрасывает исключение, если модель не найдена', async () => {
      modelRepo.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('обновляет модель', async () => {
      const existingModel = {
        id: 1,
        name: 'Old',
        type: { id: 1 },
        profiles: [],
        isDeleted: false,
      } as Model;

      const dto = {
        name: 'Updated',
        typeId: 2,
        profileIds: [2],
      };

      const newType = { id: 2 } as Type;
      const newProfiles = [{ id: 2 }] as Profile[];

      jest.spyOn(service, 'findOne').mockResolvedValue(existingModel);
      typeRepo.findOneBy.mockResolvedValue(newType);
      profileRepo.findBy.mockResolvedValue(newProfiles);
      modelRepo.save.mockResolvedValue({
        ...existingModel,
        ...dto,
        type: newType,
        profiles: newProfiles,
      });

      const result = await service.update(1, dto);
      expect(result).toEqual({
        ...existingModel,
        ...dto,
        type: newType,
        profiles: newProfiles,
      });
    });
  });

  describe('remove', () => {
    it('мягко удаляет модель', async () => {
      const model = { id: 1, isDeleted: false } as Model;
      jest.spyOn(service, 'findOne').mockResolvedValue(model);

      await service.remove(1);
      expect(modelRepo.save).toHaveBeenCalledWith({
        ...model,
        isDeleted: true,
      });
    });
  });
});
