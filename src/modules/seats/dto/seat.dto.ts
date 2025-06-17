import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min, MinLength, IsBoolean, Max } from 'class-validator';
import { RoomDto } from 'src/modules/rooms/dto/room.dto';

export class SeatDto {
  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ description: 'Unique identifier for the seat', example: 1 })
  id!: number;

  @ApiProperty({ description: 'Room details' })
  room!: RoomDto;

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

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({ description: 'Indicates if the seat is occupied', example: false })
  is_occupied!: boolean;
}
