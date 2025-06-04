import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { ProfileController } from './profile.controller';
import { Type as TypeEntity } from 'src/type/entities/type.entity';
import { Feature } from 'src/feature/entities/feature.entity';
import { ProfileService } from './profile.service';

@Module({
  imports: [TypeOrmModule.forFeature([Profile, TypeEntity, Feature])],
  providers: [ProfileService],
  controllers: [ProfileController],
})
export class ProfileModule {}
