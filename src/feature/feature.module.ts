import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feature } from './entities/feature.entity';
import { FeatureService } from './feature.service';
import { FeatureController } from './feature.controller';
import { Profile } from 'src/profile/entities/profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Feature, Profile])],
  providers: [FeatureService],
  controllers: [FeatureController],
})
export class FeatureModule {}
