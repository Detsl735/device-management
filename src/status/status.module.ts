import { Module } from '@nestjs/common';
import { Status } from './entities/status.entity';

@Module({
  imports: [Status],
})
export class StatusModule {}
