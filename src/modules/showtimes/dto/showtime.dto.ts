import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { MovieDto } from 'src/modules/movies/dto/movie.dto';
import { RoomDto } from 'src/modules/rooms/dto/room.dto';

export class ShowtimeDto {
  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ description: 'Unique identifier for the showtime', example: 1 })
  id!: number;

  @ApiProperty({ description: 'Movie details' })
  movie!: MovieDto;

  @ApiProperty({ description: 'Room details' })
  room!: RoomDto;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  @ApiProperty({ description: 'Start time of the show', example: '2025-06-20T18:00:00Z' })
  start_time!: Date;
}
