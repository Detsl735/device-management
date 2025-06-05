import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceLog } from './entities/devicelog.entity';
import { DevicelogService } from './devicelog.service';
import { DevicelogController } from './devicelog.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DeviceLog])],
  providers: [DevicelogService],
  controllers: [DevicelogController],
  exports: [TypeOrmModule],
})
export class DevicelogModule {}
