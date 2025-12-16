import { validate } from 'class-validator';
import { UpdateShowtimeDto } from './update-showtime.dto';

describe('UpdateShowtimeDto', () => {
  it('should be valid when empty (all fields optional)', async () => {
    const dto = new UpdateShowtimeDto();

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should validate provided price when present (min 0)', async () => {
    const dto = new UpdateShowtimeDto();

    dto.price = -5 as unknown as number;

    const errors = await validate(dto);
    const priceErrors = errors.find(error => error.property === 'price');

    expect(priceErrors).toBeDefined();
    expect(priceErrors?.constraints).toHaveProperty('min');
  });
});
