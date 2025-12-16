import { validate } from 'class-validator';
import { ShowtimeBaseDto } from './showtime-base.dto';
import { MovieBaseDto } from '../../movies/dto/movie-base.dto';
import { RoomBaseDto } from '../../rooms/dto/room-base.dto';

describe('ShowtimeBaseDto', () => {
  it('should be valid with correct data', async () => {
    const dto = new ShowtimeBaseDto();

    dto.id = 1;
    dto.start_time = new Date('2025-06-18T20:00:00Z');
    dto.format = 'Standard';
    dto.price = 9.99;

    dto.movie = new MovieBaseDto();
    dto.movie.id = 1;
    dto.movie.title = 'Inception';
    dto.movie.duration = 148;

    dto.room = new RoomBaseDto();
    dto.room.id = 1;
    dto.room.name = 'Room A';
    dto.room.capacity = 50;

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should be invalid if id is not present', async () => {
    const dto = new ShowtimeBaseDto();

    dto.start_time = new Date('2025-06-18T20:00:00Z');
    dto.format = 'Standard';
    dto.price = 9.99;

    const errors = await validate(dto);
    const idErrors = errors.find(error => error.property === 'id');

    expect(idErrors).toBeDefined();
  });
});
