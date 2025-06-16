import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class UserDto {
  @IsNotEmpty()
  id!: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  name!: string;
  
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  password!: string;
}
