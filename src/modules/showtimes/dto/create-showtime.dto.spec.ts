import { validate } from 'class-validator';
import { CreateShowtimeDto } from './create-showtime.dto';
import { plainToInstance } from 'class-transformer';

describe('CreateShowtimeDto', () => {
  it('should be valid with correct data', async () => {
    const dto = new CreateShowtimeDto();

    dto.movie_id = 1;
    dto.room_id = 2;
    dto.start_time = new Date('2025-06-18T20:00:00Z');
    dto.format = 'IMAX 3D';
    dto.price = 12.99;

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should be convert string to Date', async () => {
    const input = {
      start_time: '2025-06-18T20:00:00Z',
      format: 'IMAX 3D',
      price: 12.99,
      movie_id: 1,
      room_id: 2,
    };

    const dto = plainToInstance(CreateShowtimeDto, input);

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should be invalid if start_time is not a valid date string', async () => {
    const dto = new CreateShowtimeDto();

    dto.movie_id = 1;
    dto.room_id = 2;
    dto.start_time = 'not-a-date' as unknown as Date;
    dto.format = 'IMAX 3D';
    dto.price = 12.99;

    const errors = await validate(dto);
    const startErrors = errors.find(error => error.property === 'start_time');

    expect(startErrors).toBeDefined();
  });

  it('should be invalid if price is negative', async () => {
    const dto = new CreateShowtimeDto();

    dto.movie_id = 1;
    dto.room_id = 2;
    dto.start_time = new Date('2025-06-18T20:00:00Z');
    dto.format = 'IMAX 3D';
    dto.price = -1 as unknown as number;

    const errors = await validate(dto);
    const priceErrors = errors.find(error => error.property === 'price');

    expect(priceErrors).toBeDefined();
    expect(priceErrors?.constraints).toHaveProperty('min');
  });
});
