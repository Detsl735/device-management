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
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('profiles')
@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  create(@Body() dto: CreateProfileDto) {
    return this.profileService.create(dto);
  }

  @Get()
  findAll() {
    return this.profileService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.profileService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProfileDto) {
    return this.profileService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.profileService.remove(id);
  }
}
