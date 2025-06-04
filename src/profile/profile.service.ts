import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Profile } from './entities/profile.entity';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Type } from '../type/entities/type.entity';
import { Feature } from '../feature/entities/feature.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,

    @InjectRepository(Type)
    private readonly typeRepository: Repository<Type>,

    @InjectRepository(Feature)
    private readonly featureRepository: Repository<Feature>,
  ) {}

  async create(dto: CreateProfileDto): Promise<Profile> {
    const type = await this.typeRepository.findOneBy({ id: dto.typeId });
    if (!type) throw new NotFoundException(`Type ID ${dto.typeId} not found`);

    const features = dto.featureIds?.length
      ? await this.featureRepository.findBy({ id: In(dto.featureIds) })
      : [];

    const profile = this.profileRepository.create({
      name: dto.name,
      isCustom: dto.isCustom,
      type,
      features,
    });

    return this.profileRepository.save(profile);
  }

  async findAll(): Promise<Profile[]> {
    return this.profileRepository.find({
      where: { isDeleted: false },
      relations: ['type', 'features'],
    });
  }

  async findOne(id: number): Promise<Profile> {
    const profile = await this.profileRepository.findOne({
      where: { id, isDeleted: false },
      relations: ['type', 'features'],
    });
    if (!profile)
      throw new NotFoundException(`Profile with ID ${id} not found`);
    return profile;
  }

  async update(id: number, dto: UpdateProfileDto): Promise<Profile> {
    const profile = await this.findOne(id);

    if (dto.name !== undefined) profile.name = dto.name;
    if (dto.isCustom !== undefined) profile.isCustom = dto.isCustom;

    if (dto.typeId !== undefined) {
      const type = await this.typeRepository.findOneBy({ id: dto.typeId });
      if (!type) throw new NotFoundException(`Type ID ${dto.typeId} not found`);
      profile.type = type;
    }

    if (dto.featureIds !== undefined) {
      profile.features = dto.featureIds.length
        ? await this.featureRepository.findBy({ id: In(dto.featureIds) })
        : [];
    }

    return this.profileRepository.save(profile);
  }

  async remove(id: number): Promise<void> {
    const profile = await this.findOne(id);
    profile.isDeleted = true;
    await this.profileRepository.save(profile);
  }
}
