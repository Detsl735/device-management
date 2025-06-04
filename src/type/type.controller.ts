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
import { TypeService } from './type.service';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('types')
@Controller('types')
export class TypeController {
  constructor(private readonly typeService: TypeService) {}

  @Post()
  create(@Body() dto: CreateTypeDto) {
    return this.typeService.create(dto);
  }

  @Get()
  findAll() {
    return this.typeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.typeService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTypeDto) {
    return this.typeService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.typeService.remove(id);
  }
}
