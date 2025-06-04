import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsBoolean,
  IsInt,
  IsArray,
  IsOptional,
} from 'class-validator';

export class CreateProfileDto {
  @ApiProperty({ example: 'Офисный профиль' })
  @IsString()
  name: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  isCustom: boolean;

  @ApiProperty({ example: 2 })
  @IsInt()
  typeId: number;

  @ApiProperty({
    example: [1, 3, 5],
    description: 'IDs of assigned features',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  featureIds?: number[];
}
