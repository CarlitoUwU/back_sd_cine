import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";


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