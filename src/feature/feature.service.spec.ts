import { Test, TestingModule } from '@nestjs/testing';
import { FeatureService } from './feature.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Feature } from './entities/feature.entity';
import { Profile } from '../profile/entities/profile.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

const mockFeatureRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findBy: jest.fn(),
  remove: jest.fn(),
});

const mockProfileRepository = () => ({
  findBy: jest.fn(),
});

describe('FeatureService', () => {
  let service: FeatureService;
  let featureRepo: jest.Mocked<Repository<Feature>>;
  let profileRepo: jest.Mocked<Repository<Profile>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeatureService,
        {
          provide: getRepositoryToken(Feature),
          useFactory: mockFeatureRepository,
        },
        {
          provide: getRepositoryToken(Profile),
          useFactory: mockProfileRepository,
        },
      ],
    }).compile();

    service = module.get<FeatureService>(FeatureService);
    featureRepo = module.get(getRepositoryToken(Feature));
    profileRepo = module.get(getRepositoryToken(Profile));
  });

  it('должен быть определён', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('создаёт новую фичу', async () => {
      const dto = {
        name: 'Фича',
        variableName: 'canDo',
        profileIds: [1],
      };
      const profiles = [{ id: 1 } as Profile];

      profileRepo.findBy.mockResolvedValue(profiles);
      const createdFeature = {
        id: 1,
        name: dto.name,
        variableName: dto.variableName,
        profiles,
      } as Feature;

      featureRepo.create.mockReturnValue(createdFeature);
      featureRepo.save.mockResolvedValue(createdFeature);

      const result = await service.create(dto);
      expect(profileRepo.findBy).toHaveBeenCalledWith({
        id: expect.anything(),
      });

      // ✅ Исправленный вызов:
      expect(featureRepo.create).toHaveBeenCalledWith({
        name: dto.name,
        variableName: dto.variableName,
        profiles,
      });

      expect(result).toEqual(createdFeature);
    });
  });

  describe('findAll', () => {
    it('возвращает список всех фич', async () => {
      const features = [{ id: 1, name: 'Фича' }] as Feature[];
      featureRepo.find.mockResolvedValue(features);

      const result = await service.findAll();
      expect(result).toEqual(features);
      expect(featureRepo.find).toHaveBeenCalledWith({
        relations: ['profiles'],
      });
    });
  });

  describe('findOne', () => {
    it('возвращает одну фичу', async () => {
      const feature = { id: 1, name: 'Одна фича' } as Feature;
      featureRepo.find.mockResolvedValue([feature]);

      const result = await service.findOne(1);
      expect(result).toEqual(feature);
    });

    it('выбрасывает исключение, если не найдено', async () => {
      featureRepo.find.mockResolvedValue([]);

      await expect(service.findOne(42)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('обновляет фичу', async () => {
      const oldFeature = { id: 1, name: 'Старая' } as Feature;
      const updated = {
        id: 1,
        name: 'Новая',
        variableName: 'newVar',
      } as Feature;

      featureRepo.find.mockResolvedValue([oldFeature]);
      profileRepo.findBy.mockResolvedValue([]);
      featureRepo.save.mockResolvedValue(updated);

      const result = await service.update(1, {
        name: 'Новая',
        variableName: 'newVar',
        profileIds: [],
      });

      expect(result).toEqual(updated);
    });
  });

  describe('remove', () => {
    it('удаляет фичу', async () => {
      const feature = { id: 1, name: 'Удалить' } as Feature;
      featureRepo.find.mockResolvedValue([feature]);
      featureRepo.remove.mockResolvedValue(undefined);

      await service.remove(1);
      expect(featureRepo.remove).toHaveBeenCalledWith(feature);
    });
  });
});
