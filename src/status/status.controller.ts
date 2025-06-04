import { Controller, Get } from '@nestjs/common';
import { StatusService } from './status.service';
import { Status } from './entities/status.entity';

@Controller('statuses')
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @Get()
  findAll(): Promise<Status[]> {
    return this.statusService.findAll();
  }
}
