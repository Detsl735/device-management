import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Feature } from './entities/feature.entity';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { UpdateFeatureDto } from './dto/update-feature.dto';
import { Profile } from 'src/profile/entities/profile.entity';

@Injectable()
export class FeatureService {
  constructor(
    @InjectRepository(Feature)
    private readonly featureRepository: Repository<Feature>,

    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async create(dto: CreateFeatureDto): Promise<Feature> {
    const profiles = dto.profileIds?.length
      ? await this.profileRepository.findBy({ id: In(dto.profileIds) })
      : [];

    const feature = this.featureRepository.create({
      name: dto.name,
      variableName: dto.variableName,
      profiles,
    });

    return this.featureRepository.save(feature);
  }

  async findAll(): Promise<Feature[]> {
    return this.featureRepository.find({
      relations: ['profiles'],
    });
  }

  async findOne(id: number): Promise<Feature> {
    const feature = await this.featureRepository.find({
      where: { id },
      relations: ['profiles'],
    });

    if (!feature?.length) {
      throw new NotFoundException(`Feature with ID ${id} not found`);
    }

    return feature[0];
  }

  async update(id: number, dto: UpdateFeatureDto): Promise<Feature> {
    const feature = await this.findOne(id);

    if (dto.name !== undefined) feature.name = dto.name;
    if (dto.variableName !== undefined) feature.variableName = dto.variableName;

    if (dto.profileIds !== undefined) {
      feature.profiles = dto.profileIds.length
        ? await this.profileRepository.findBy({ id: In(dto.profileIds) })
        : [];
    }

    return this.featureRepository.save(feature);
  }

  async remove(id: number): Promise<void> {
    const feature = await this.findOne(id);
    await this.featureRepository.remove(feature);
  }
}
