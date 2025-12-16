import { validate } from 'class-validator';
import { UpdateSeatDto } from './update-seat.dto';

describe('UpdateSeatDto', () => {
  it('should be valid when empty (all fields optional)', async () => {
    const dto = new UpdateSeatDto();

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should validate provided capacity when present (min 1)', async () => {
    const dto = new UpdateSeatDto();

    dto.seat_number = 0;

    const errors = await validate(dto);
    const seatNumberErrors = errors.find(error => error.property === 'seat_number');

    expect(seatNumberErrors).toBeDefined();
    expect(seatNumberErrors?.constraints).toHaveProperty('min');
  });
});
