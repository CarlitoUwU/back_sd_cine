import { validate } from 'class-validator';
import { ShowtimeDto } from './showtime.dto';
import { MovieBaseDto } from '../../movies/dto/movie-base.dto';
import { RoomBaseDto } from '../../rooms/dto/room-base.dto';
import { plainToInstance } from 'class-transformer';

describe('ShowtimeDto', () => {
  it('should be valid with correct data', async () => {
    const dto = new ShowtimeDto();

    dto.id = 1;
    dto.start_time = new Date('2025-06-18T20:00:00Z');
    dto.format = 'IMAX 3D';
    dto.price = 12.99;

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

  it('should be valid with input string and objects', async () => {
    const input = {
      id: 1,
      start_time: '2025-06-18T20:00:00Z',
      format: 'IMAX 3D',
      price: 12.99,

      movie: {
        id: 1,
        title: 'Inception',
        duration: 148,
      },

      room: {
        id: 1,
        name: 'Room A',
        capacity: 50,
      },
    };

    const dto = plainToInstance(ShowtimeDto, input);

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should be invalid if id is missing', async () => {
    const dto = new ShowtimeDto();

    dto.start_time = new Date('2025-06-18T20:00:00Z');
    dto.format = 'IMAX 3D';
    dto.price = 12.99;

    const errors = await validate(dto);
    const idErrors = errors.find(error => error.property === 'id');

    expect(idErrors).toBeDefined();
  });
});
