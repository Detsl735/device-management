import { Controller, Get } from '@nestjs/common';
import { DevicelogService } from './devicelog.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('devicelogs')
@Controller('devicelogs')
export class DevicelogController {
  constructor(private readonly devicelogService: DevicelogService) {}

  @Get()
  findAll() {
    return this.devicelogService.findAll();
  }
}
