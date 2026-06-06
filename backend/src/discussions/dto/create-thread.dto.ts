import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateThreadDto {
  @ApiProperty({ example: 'How is campus life at IIT Bombay?' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'I want to know about hostels, food, clubs, etc.' })
  @IsNotEmpty()
  @IsString()
  body: string;

  @ApiProperty({ example: 'Campus Life' })
  @IsNotEmpty()
  @IsString()
  category: string;

  @ApiPropertyOptional({ example: 'clxyz123' })
  @IsOptional()
  @IsString()
  collegeId?: string;
}
