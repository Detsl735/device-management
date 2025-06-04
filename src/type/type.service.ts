import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Type } from './entities/type.entity';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';

@Injectable()
export class TypeService {
  constructor(
    @InjectRepository(Type)
    private readonly typeRepository: Repository<Type>,
  ) {}

  async create(dto: CreateTypeDto): Promise<Type> {
    const type = this.typeRepository.create(dto);
    return this.typeRepository.save(type);
  }

  async findAll(): Promise<Type[]> {
    return this.typeRepository.find({
      where: { isDeleted: false },
    });
  }

  async findOne(id: number): Promise<Type> {
    const type = await this.typeRepository.findOneBy({ id, isDeleted: false });
    if (!type) throw new NotFoundException(`Type with ID ${id} not found`);
    return type;
  }

  async update(id: number, dto: UpdateTypeDto): Promise<Type> {
    const type = await this.findOne(id);
    Object.assign(type, dto);
    return this.typeRepository.save(type);
  }

  async remove(id: number): Promise<void> {
    const type = await this.findOne(id);
    type.isDeleted = true;
    await this.typeRepository.save(type);
  }
}
