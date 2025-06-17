import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min, MinLength } from 'class-validator';

export class SeatDto {
  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ description: 'Unique identifier for the seat', example: 1 })
  id!: number;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ description: 'ID of the room', example: 2 })
  room_id!: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @ApiProperty({ description: 'Seat number', example: 12 })
  seat_number!: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @ApiProperty({ description: 'Row identifier (e.g., A, B, C)', example: 'B' })
  row!: string;
}
