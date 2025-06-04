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
import { ModelService } from './model.service';
import { CreateModelDto } from './dto/create-model.dto';
import { UpdateModelDto } from './dto/update-model.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('models')
@Controller('models')
export class ModelController {
  constructor(private readonly modelService: ModelService) {}

  @Post()
  create(@Body() dto: CreateModelDto) {
    return this.modelService.create(dto);
  }

  @Get()
  findAll() {
    return this.modelService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.modelService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateModelDto) {
    return this.modelService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.modelService.remove(id);
  }
}
