import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAnswerDto {
  @ApiProperty({ example: 'The campus life is amazing! Great clubs and events.' })
  @IsNotEmpty()
  @IsString()
  body: string;
}
