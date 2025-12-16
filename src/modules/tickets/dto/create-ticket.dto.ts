import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Max, Min, MinLength } from 'class-validator';

export class CreateTicketDto {
  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ example: 1 })
  user_id!: number;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ example: 2 })
  showtime_id!: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(10)
  @ApiProperty({ description: 'Seat number', example: 10 })
  seat_number!: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @ApiProperty({ description: 'Row identifier (e.g., A, B, C)', example: 'B' })
  row!: string;
}
