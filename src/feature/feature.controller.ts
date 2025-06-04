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
import { FeatureService } from './feature.service';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { UpdateFeatureDto } from './dto/update-feature.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('features')
@Controller('features')
export class FeatureController {
  constructor(private readonly featureService: FeatureService) {}

  @Post()
  create(@Body() dto: CreateFeatureDto) {
    return this.featureService.create(dto);
  }

  @Get()
  findAll() {
    return this.featureService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.featureService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateFeatureDto) {
    return this.featureService.update(id, dto);
  }
}
