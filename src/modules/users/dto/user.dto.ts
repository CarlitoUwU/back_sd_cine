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
  @MinLength(2)
  @ApiProperty({ description: 'First name of the user', type: String, example: 'John' })
  first_name!: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @ApiProperty({ description: 'Last name of the user', type: String, example: 'Doe' })
  last_name!: string;

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
