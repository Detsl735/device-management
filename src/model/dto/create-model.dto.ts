import {
  IsString,
  IsInt,
  IsArray,
  ArrayNotEmpty,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateModelDto {
  @ApiProperty({ example: 'DIR-615' })
  @IsString()
  name: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  typeId: number;

  @ApiProperty({
    example: [1, 2, 3],
    description: 'ID функциональных возможностей',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  profileIds?: number[];
}
