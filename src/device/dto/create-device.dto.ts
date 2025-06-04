import { IsInt, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDeviceDto {
  @ApiProperty({ example: 'ABC123456' })
  @IsString()
  serialNum: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  modelId: number;

  @ApiProperty({ example: 2, required: false })
  @IsOptional()
  @IsInt()
  employeeId?: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  statusId: number;
}
