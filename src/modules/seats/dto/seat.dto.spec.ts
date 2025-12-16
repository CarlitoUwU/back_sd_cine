import { validate } from 'class-validator';
import { SeatDto } from './seat.dto';
import { RoomDto } from '../../rooms/dto/room.dto';

describe('SeatDto', () => {
  it('should be valid with correct data', async () => {
    const dto = new SeatDto();

    dto.id = 1;
    dto.room = new RoomDto();
    dto.room.id = 1;
    dto.room.name = 'Room A';
    dto.room.capacity = 50;
    dto.seat_number = 5;
    dto.row = 'B';
    dto.is_occupied = false;

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should be invalid if id is not present', async () => {
    const dto = new SeatDto();

    dto.room = new RoomDto();
    dto.room.id = 1;
    dto.room.name = 'Room A';
    dto.room.capacity = 50;
    dto.seat_number = 5;
    dto.row = 'B';
    dto.is_occupied = false;

    const errors = await validate(dto);
    const idErrors = errors.find(error => error.property === 'id');

    expect(idErrors).toBeDefined();
  });

  it('should be invalid if seat_number is out of bounds', async () => {
    const dto = new SeatDto();

    dto.id = 1;
    dto.room = new RoomDto();
    dto.room.id = 1;
    dto.room.name = 'Room A';
    dto.room.capacity = 50;
    dto.seat_number = 0;
    dto.row = 'B';
    dto.is_occupied = false;

    const errors = await validate(dto);
    const seatNumberErrors = errors.find(error => error.property === 'seat_number');

    expect(seatNumberErrors).toBeDefined();
    expect(seatNumberErrors?.constraints).toHaveProperty('min');
  });
});
