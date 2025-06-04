import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Type as TypeEntity } from './entities/type.entity';
import { TypeController } from './type.controller';
import { TypeService } from './type.service';

@Module({
  imports: [TypeOrmModule.forFeature([TypeEntity])],
  providers: [TypeService],
  controllers: [TypeController],
})
export class TypeModule {}
