import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Model } from './entities/model.entity';
import { Type as TypeEntity } from 'src/type/entities/type.entity';
import { Profile } from 'src/profile/entities/profile.entity';
import { ModelController } from './model.controller';
import { ModelService } from './model.service';

@Module({
  imports: [TypeOrmModule.forFeature([Model, TypeEntity, Profile])],
  controllers: [ModelController],
  providers: [ModelService],
})
export class ModelModule {}
