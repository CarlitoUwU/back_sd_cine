import { validate } from 'class-validator';
import { CreateRoomDto } from './create-room.dto';

describe('CreateRoomDto', () => {
  it('should be valid without id and with required fields', async () => {
    const dto = new CreateRoomDto();

    dto.name = 'Room A';
    dto.capacity = 50;

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should be invalid if name is not present', async () => {
    const dto = new CreateRoomDto();

    dto.capacity = 50;

    const errors = await validate(dto);
    const nameErrors = errors.find(error => error.property === 'name');

    expect(nameErrors).toBeDefined();
  });

  it('should be invalid if capacity is less than 1', async () => {
    const dto = new CreateRoomDto();

    dto.name = 'Room A';
    dto.capacity = 0;

    const errors = await validate(dto);
    const capacityErrors = errors.find(error => error.property === 'capacity');

    expect(capacityErrors).toBeDefined();
    expect(capacityErrors?.constraints).toHaveProperty('min');
  });
});
