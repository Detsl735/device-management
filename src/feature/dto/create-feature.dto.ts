import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsInt } from 'class-validator';

export class CreateFeatureDto {
  @ApiProperty({ example: 'Печать документов' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'canPrintDocuments' })
  @IsString()
  variableName: string;

  @ApiProperty({
    example: [1, 2],
    description: 'IDs of profiles this feature belongs to',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  profileIds?: number[];
}
