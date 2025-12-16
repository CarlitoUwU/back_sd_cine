import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsPositive, Min, Max } from 'class-validator';

export class VerifyResetCodeDto {
  @ApiProperty({
    description: 'Email address of the user',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;

  @ApiProperty({
    description: 'Reset code sent to user email (6-digit number)',
    example: 123456,
    minimum: 100000,
    maximum: 999999,
  })
  @IsNumber({}, { message: 'Code must be a number' })
  @IsPositive({ message: 'Code must be a positive number' })
  @Min(100000, { message: 'Code must be a 6-digit number' })
  @Max(999999, { message: 'Code must be a 6-digit number' })
  @IsNotEmpty({ message: 'Code is required' })
  code!: number;
}
