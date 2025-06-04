import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Model } from './entities/model.entity';
import { Type } from '../type/entities/type.entity';
import { Profile } from '../profile/entities/profile.entity';
import { CreateModelDto } from './dto/create-model.dto';
import { UpdateModelDto } from './dto/update-model.dto';

@Injectable()
export class ModelService {
  constructor(
    @InjectRepository(Model)
    private readonly modelRepository: Repository<Model>,
    @InjectRepository(Type)
    private readonly typeRepository: Repository<Type>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async create(dto: CreateModelDto): Promise<Model> {
    const type = await this.typeRepository.findOneBy({ id: dto.typeId });
    if (!type) {
      throw new Error(`Type with ID ${dto.typeId} not found`);
    }

    let profiles: Profile[] = [];
    if (dto.profileIds && dto.profileIds.length) {
      profiles = await this.profileRepository.findBy({
        id: In(dto.profileIds),
      });
    }

    const model = this.modelRepository.create({
      name: dto.name,
      type,
      profiles,
    });
    return this.modelRepository.save(model);
  }

  async findAll(): Promise<Model[]> {
    return this.modelRepository.find({
      where: { isDeleted: false },
      relations: ['type', 'profiles'],
    });
  }

  async findOne(id: number): Promise<Model> {
    const model = await this.modelRepository.findOne({
      where: { id, isDeleted: false },
      relations: ['type', 'profiles'],
    });
    if (!model) throw new NotFoundException(`Model with ID ${id} not found`);
    return model;
  }

  async update(id: number, dto: UpdateModelDto): Promise<Model> {
    const model = await this.findOne(id);

    if (dto.name !== undefined) {
      model.name = dto.name;
    }

    if (dto.typeId !== undefined) {
      const type = await this.typeRepository.findOneBy({ id: dto.typeId });
      if (!type) {
        throw new Error(`Type with ID ${dto.typeId} not found`);
      }
      model.type = type;
    }

    if (dto.profileIds !== undefined) {
      model.profiles = dto.profileIds.length
        ? await this.profileRepository.findBy({ id: In(dto.profileIds) })
        : [];
    }
    return this.modelRepository.save(model);
  }

  async remove(id: number): Promise<void> {
    const model = await this.findOne(id);
    model.isDeleted = true;
    await this.modelRepository.save(model);
  }
}
