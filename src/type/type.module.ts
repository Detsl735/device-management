import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Type as TypeEntity } from './entities/type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TypeEntity])],
  providers: [],
  controllers: [],
})
export class TypeModule {}
