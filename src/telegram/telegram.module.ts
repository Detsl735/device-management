import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { TelegramUpdate } from './telegram.update';
import { TelegramService } from './telegram.service';
import { DeviceService } from 'src/device/device.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from 'src/device/entities/device.entity';
import { Model } from 'src/model/entities/model.entity';
import { Employee } from 'src/employee/entities/employee.entity';
import { Status } from 'src/status/entities/status.entity';
import { DeviceLog } from 'src/devicelog/entities/devicelog.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Device, Model, Employee, Status, DeviceLog]),
  ],
  providers: [TelegramUpdate, TelegramService, DeviceService],
  exports: [TelegramService], // если нужно использовать в других модулях
})
export class TelegramModule {}
