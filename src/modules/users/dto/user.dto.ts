import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class UserDto {
  @IsNotEmpty()
  @ApiProperty({ description: 'Unique identifier for the user', type: Number, example: 1 })
  id!: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @ApiProperty({ description: 'Name of the user', type: String, example: 'John Doe' })
  name!: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ description: 'Email address of the user', type: String, example: 'example@gmail.com' })
  email!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @ApiProperty({ description: 'Password for the user', type: String, example: 'password123' })
  password!: string;
}
