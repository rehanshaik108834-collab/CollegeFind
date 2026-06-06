import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'Rahul Sharma' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'rahul@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string;
}

export class LoginDto {
  @ApiProperty({ example: 'demo@college.in' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'demo1234' })
  @IsString()
  password: string;
}
