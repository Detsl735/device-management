import { Module } from '@nestjs/common';
import { Status } from './entities/status.entity';
import { StatusService } from './status.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatusController } from './status.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Status])],
  providers: [StatusService],
  controllers: [StatusController],
})
export class StatusModule {}
