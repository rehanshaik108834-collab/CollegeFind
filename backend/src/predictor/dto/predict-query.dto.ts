import { IsNotEmpty, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PredictQueryDto {
  @ApiProperty({ example: 'JEE', description: 'Exam name: JEE or NEET' })
  @IsNotEmpty()
  @IsString()
  exam: string;

  @ApiProperty({ example: 5000, description: 'Your exam rank' })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  rank: number;

  @ApiProperty({ example: 'General', description: 'Category: General, OBC, SC, ST, EWS' })
  @IsNotEmpty()
  @IsString()
  category: string;
}
