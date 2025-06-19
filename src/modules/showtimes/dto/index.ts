import { OmitType, ApiProperty } from '@nestjs/swagger';
import { ShowtimeDto } from './showtime.dto';
import { IsDateString, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class ShowtimeBaseDto extends OmitType(ShowtimeDto, [] as const) { }

export class CreateShowtimeDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 1 })
  movie_id: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 2 })
  room_id: number;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty({ example: '2025-06-18T20:00:00Z' })
  start_time: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'IMAX 3D' })
  format: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @ApiProperty({ example: 12.99 })
  price: number;
}
