import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min, MinLength, IsBoolean, Max, IsOptional } from 'class-validator';

export class CreateSeatDto {
  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ description: 'ID of the room', example: 2 })
  room_id!: number;

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

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ description: 'Indicates if the seat is occupied', example: false })
  is_occupied?: boolean;
}
