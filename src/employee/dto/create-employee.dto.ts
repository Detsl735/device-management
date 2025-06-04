import { IsEmail, IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEmployeeDto {
  @ApiProperty({ example: 'ivanov@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '4B' })
  @IsString()
  floor: string;

  @ApiProperty({ example: 'user' })
  @IsString()
  role: string;

  @ApiProperty({ example: 'Ivan' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Ivanov' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: 123456789, required: false })
  @IsOptional()
  telegramId?: number;

  @ApiProperty({ example: '12' })
  @IsString()
  tableNum: string;
}
