import { OmitType, ApiProperty } from '@nestjs/swagger';
import { ShowtimeDto } from './showtime.dto';
import { IsInt, IsNotEmpty, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class ShowtimeBaseDto extends OmitType(ShowtimeDto, [] as const) { }

export class CreateShowtimeDto {
  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ description: 'ID of the movie', example: 3 })
  movie_id!: number;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ description: 'ID of the room', example: 2 })
  room_id!: number;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  @ApiProperty({ description: 'Start time of the show', example: '2025-06-20T18:00:00Z' })
  start_time!: Date;
}
