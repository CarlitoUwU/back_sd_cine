import { validate } from 'class-validator';
import { CreateSeatDto } from './create-seat.dto';

describe('CreateSeatDto', () => {
  it('should be valid without id and with required fields', async () => {
    const dto = new CreateSeatDto();

    dto.room_id = 2;
    dto.seat_number = 5;
    dto.row = 'A';

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should be invalid if seat_number is out of bounds', async () => {
    const dto = new CreateSeatDto();

    dto.room_id = 2;
    dto.seat_number = 11;
    dto.row = 'A';

    const errors = await validate(dto);
    const seatNumberErrors = errors.find(error => error.property === 'seat_number');

    expect(seatNumberErrors).toBeDefined();
    expect(seatNumberErrors?.constraints).toHaveProperty('max');
  });
});
