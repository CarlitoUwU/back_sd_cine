import { OmitType, ApiProperty } from '@nestjs/swagger';
import { UserDto } from './user.dto';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UserBaseDto extends OmitType(UserDto, ['password'] as const) { }

export class CreateUserDto extends OmitType(UserDto, ['id'] as const) { }

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: 'Email of the user', example: 'user@example.com' })
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @ApiProperty({ description: 'Password of the user', example: 'password123' })
  password!: string;
}
