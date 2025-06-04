import { Test, TestingModule } from '@nestjs/testing';
import { ProfileService } from './profile.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';
import { Type } from '../type/entities/type.entity';
import { Feature } from '../feature/entities/feature.entity';
import { NotFoundException } from '@nestjs/common';

describe('ProfileService', () => {
  let service: ProfileService;
  let profileRepo: jest.Mocked<Repository<Profile>>;
  let typeRepo: jest.Mocked<Repository<Type>>;
  let featureRepo: jest.Mocked<Repository<Feature>>;

  const mockRepo = () => ({
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    findBy: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        { provide: getRepositoryToken(Profile), useFactory: mockRepo },
        { provide: getRepositoryToken(Type), useFactory: mockRepo },
        { provide: getRepositoryToken(Feature), useFactory: mockRepo },
      ],
    }).compile();

    service = module.get(ProfileService);
    profileRepo = module.get(getRepositoryToken(Profile));
    typeRepo = module.get(getRepositoryToken(Type));
    featureRepo = module.get(getRepositoryToken(Feature));
  });

  it('должен быть определён', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('выбрасывает ошибку, если тип не найден', async () => {
      typeRepo.findOneBy.mockResolvedValue(null);
      await expect(
        service.create({
          name: 'Тест',
          isCustom: true,
          typeId: 999,
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('создаёт профиль с фичами', async () => {
      const dto = {
        name: 'Офисный',
        isCustom: true,
        typeId: 1,
        featureIds: [1],
      };
      const type = { id: 1 } as Type;
      const features = [{ id: 1 }] as Feature[];

      typeRepo.findOneBy.mockResolvedValue(type);
      featureRepo.findBy.mockResolvedValue(features);

      const profile = {
        id: 1,
        name: dto.name,
        isCustom: dto.isCustom,
        type,
        features,
        isDeleted: false,
        models: [], // если есть
      } as Profile;

      profileRepo.create.mockReturnValue(profile);
      profileRepo.save.mockResolvedValue({ id: 1, ...profile });

      const result = await service.create(dto);

      expect(result).toEqual({ id: 1, ...profile });
      expect(profileRepo.create).toHaveBeenCalledWith({
        name: dto.name,
        isCustom: dto.isCustom,
        type,
        features,
      });
    });
  });

  describe('findAll', () => {
    it('возвращает список профилей', async () => {
      const profiles = [{ id: 1, isDeleted: false }] as Profile[];
      profileRepo.find.mockResolvedValue(profiles);

      const result = await service.findAll();
      expect(result).toEqual(profiles);
      expect(profileRepo.find).toHaveBeenCalledWith({
        where: { isDeleted: false },
        relations: ['type', 'features'],
      });
    });
  });

  describe('findOne', () => {
    it('возвращает профиль по id', async () => {
      const profile = { id: 1, isDeleted: false } as Profile;
      profileRepo.findOne.mockResolvedValue(profile);

      const result = await service.findOne(1);
      expect(result).toEqual(profile);
    });

    it('выбрасывает NotFound, если нет профиля', async () => {
      profileRepo.findOne.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('обновляет профиль', async () => {
      const profile = { id: 1, name: 'Старый', isCustom: false } as Profile;
      const type = { id: 2 } as Type;
      const features = [{ id: 2 }] as Feature[];

      jest.spyOn(service, 'findOne').mockResolvedValue(profile);
      typeRepo.findOneBy.mockResolvedValue(type);
      featureRepo.findBy.mockResolvedValue(features);
      profileRepo.save.mockResolvedValue({
        ...profile,
        name: 'Новый',
        type,
        features,
        isCustom: true,
      });

      const result = await service.update(1, {
        name: 'Новый',
        isCustom: true,
        typeId: 2,
        featureIds: [2],
      });

      expect(result.name).toBe('Новый');
      expect(result.type).toEqual(type);
      expect(result.features).toEqual(features);
    });
  });

  describe('remove', () => {
    it('мягко удаляет профиль', async () => {
      const profile = { id: 1, isDeleted: false } as Profile;
      jest.spyOn(service, 'findOne').mockResolvedValue(profile);
      profileRepo.save.mockResolvedValue({ ...profile, isDeleted: true });

      await service.remove(1);
      expect(profileRepo.save).toHaveBeenCalledWith({
        ...profile,
        isDeleted: true,
      });
    });
  });
});
