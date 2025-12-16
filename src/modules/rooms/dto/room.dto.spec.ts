import { validate } from 'class-validator';
import { RoomDto } from './room.dto';

describe('RoomDto', () => {
  it('should be valid with correct data', async () => {
    const dto = new RoomDto();

    dto.id = 1;
    dto.name = 'Room A';
    dto.capacity = 50;

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should be invalid if id is not present', async () => {
    const dto = new RoomDto();

    dto.name = 'Room A';
    dto.capacity = 50;

    const errors = await validate(dto);
    const idErrors = errors.find(error => error.property === 'id');

    expect(idErrors).toBeDefined();
  });

  it('should be invalid if id is not an integer', async () => {
    const dto = new RoomDto();

    dto.id = '1' as unknown as number;
    dto.name = 'Room A';
    dto.capacity = 50;

    const errors = await validate(dto);
    const idErrors = errors.find(error => error.property === 'id');
    const constraints = idErrors?.constraints;

    expect(idErrors).toBeDefined();
    expect(constraints).toHaveProperty('isInt');
  });

  it('should be invalid if name is not present', async () => {
    const dto = new RoomDto();

    dto.id = 1;
    dto.capacity = 50;

    const errors = await validate(dto);
    const nameErrors = errors.find(error => error.property === 'name');

    expect(nameErrors).toBeDefined();
  });

  it('should be invalid if capacity is less than 1', async () => {
    const dto = new RoomDto();

    dto.id = 1;
    dto.name = 'Room A';
    dto.capacity = 0;

    const errors = await validate(dto);
    const capacityErrors = errors.find(error => error.property === 'capacity');
    const constraints = capacityErrors?.constraints;

    expect(capacityErrors).toBeDefined();
    expect(constraints).toHaveProperty('min');
  });
});
