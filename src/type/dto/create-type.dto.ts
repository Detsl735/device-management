import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateTypeDto {
  @ApiProperty({ example: 'Монитор' })
  @IsString()
  name: string;
}
