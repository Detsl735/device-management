import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { DeviceService } from './device.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('devices')
@Controller('devices')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Post()
  create(@Body() dto: CreateDeviceDto) {
    return this.deviceService.create(dto);
  }

  @Get()
  findAll() {
    return this.deviceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.deviceService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateDeviceDto) {
    return this.deviceService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.deviceService.remove(id);
  }
}
