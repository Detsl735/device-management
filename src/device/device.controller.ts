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
import { UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
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

  @UseGuards(JwtAuthGuard)
  @Get('my')
  findMyDevices(@Req() req: Request) {
    const employeeId = (req.user as any).sub;
    return this.deviceService.findByEmployeeId(employeeId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.deviceService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateDeviceDto) {
    return this.deviceService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/release')
  async releaseDevice(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: Request,
  ) {
    const employeeId = (req.user as any).sub;
    return this.deviceService.releaseDevice(id, employeeId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/use')
  async useDevice(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const employeeId = (req.user as any).sub;
    return this.deviceService.useDevice(id, employeeId);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.deviceService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/request-transfer')
  async requestTransfer(
    @Param('id', ParseIntPipe) deviceId: number,
    @Req() req: Request,
  ) {
    const requesterId = (req.user as any).sub;
    return this.deviceService.requestTransfer(deviceId, requesterId);
  }
}
