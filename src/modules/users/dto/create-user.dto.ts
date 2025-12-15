import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ description: 'Email address of the user', example: 'example@gmail.com' })
  email!: string;

  @ApiProperty({ description: 'Password for the user', example: 'Password123@' })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(50, { message: 'Password must not exceed 50 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
  })
  password!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'First name of the user', example: 'John' })
  first_name!: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Last name of the user', example: 'Doe' })
  last_name!: string;
}
