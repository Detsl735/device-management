import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsInt } from 'class-validator';

export class CreateFeatureDto {
  @ApiProperty({ example: 'DNS relay' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'dnsRelay' })
  @IsString()
  variableName: string;

  @ApiProperty({
    example: [1, 2],
    description: 'ID связанных профилей',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  profileIds?: number[];
}
