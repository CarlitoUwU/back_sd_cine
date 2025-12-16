import { ApiProperty } from '@nestjs/swagger';
import { MovieBaseDto } from '../../movies/dto/movie-base.dto';
import { RoomBaseDto } from '../../rooms/dto/room-base.dto';
import { IsDate, IsInt, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ShowtimeDto {
  @IsNotEmpty()
  @IsInt()
  @ApiProperty()
  id!: number;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  @ApiProperty()
  start_time!: Date;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  format!: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @ApiProperty()
  price!: number;

  @ApiProperty({ type: () => MovieBaseDto })
  @Type(() => MovieBaseDto)
  movie!: MovieBaseDto;

  @ApiProperty({ type: () => RoomBaseDto })
  @Type(() => RoomBaseDto)
  room!: RoomBaseDto;
}
