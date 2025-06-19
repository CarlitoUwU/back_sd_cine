import { ApiProperty } from '@nestjs/swagger';
import { MovieBaseDto } from 'src/modules/movies/dto';
import { RoomBaseDto } from 'src/modules/rooms/dto';

export class ShowtimeDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  start_time: Date;

  @ApiProperty()
  format: string;

  @ApiProperty()
  price: number;

  @ApiProperty({ type: () => MovieBaseDto })
  movie: MovieBaseDto;

  @ApiProperty({ type: () => RoomBaseDto })
  room: RoomBaseDto;
}
