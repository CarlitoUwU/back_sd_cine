import { Test, TestingModule } from '@nestjs/testing';
import { SeatsService } from './seats.service';
import { PrismaService } from 'src/prisma.service';
import { CreateSeatDto } from './dto/create-seat.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('SeatsService', () => {
  let service: SeatsService;

  const prismaMock = {
    seats: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findFirst: jest.fn(),
    },
    rooms: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeatsService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<SeatsService>(SeatsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a seat (happy path)', async () => {
    const dto: CreateSeatDto = { seat_number: 5, row: 'A', room_id: 1 };

    prismaMock.rooms.findUnique.mockResolvedValue({ id: 1, name: 'Room A', capacity: 50 });
    prismaMock.seats.findFirst.mockResolvedValue(null);
    prismaMock.seats.create.mockResolvedValue({ id: 1, seat_number: 5, row: 'A', is_occupied: false, room: { id: 1, name: 'Room A', capacity: 50 } });

    const result = await service.createSeat(dto);

    expect(prismaMock.rooms.findUnique).toHaveBeenCalledWith({ where: { id: dto.room_id } });
    expect(prismaMock.seats.findFirst).toHaveBeenCalled();
    expect(prismaMock.seats.create).toHaveBeenCalled();
    expect(result.seat_number).toBe(dto.seat_number);
  });

  it('should throw BadRequestException when seat_number invalid', async () => {
    const dto: CreateSeatDto = { seat_number: 0, row: 'A', room_id: 1 };

    await expect(service.createSeat(dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw NotFoundException when room not found', async () => {
    const dto: CreateSeatDto = { seat_number: 5, row: 'A', room_id: 99 };

    prismaMock.rooms.findUnique.mockResolvedValue(null);

    await expect(service.createSeat(dto)).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException when row not allowed', async () => {
    const dto: CreateSeatDto = { seat_number: 5, row: 'Z', room_id: 1 };

    prismaMock.rooms.findUnique.mockResolvedValue({ id: 1, name: 'Room A', capacity: 10 }); // only row A allowed

    await expect(service.createSeat(dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when seat already exists', async () => {
    const dto: CreateSeatDto = { seat_number: 5, row: 'A', room_id: 1 };

    prismaMock.rooms.findUnique.mockResolvedValue({ id: 1, name: 'Room A', capacity: 50 });
    prismaMock.seats.findFirst.mockResolvedValue({ id: 2, seat_number: 5, row: 'A' });

    await expect(service.createSeat(dto)).rejects.toThrow(BadRequestException);
  });

  it('should get a seat by id', async () => {
    prismaMock.seats.findUnique.mockResolvedValue({ id: 1, seat_number: 5, row: 'A', is_occupied: false, room: { id: 1, name: 'Room A', capacity: 50 } });

    const result = await service.getSeatById(1);

    expect(prismaMock.seats.findUnique).toHaveBeenCalled();
    expect(result.id).toBe(1);
  });

  it('should throw NotFoundException when getSeatById missing', async () => {
    prismaMock.seats.findUnique.mockResolvedValue(null);

    await expect(service.getSeatById(999)).rejects.toThrow(NotFoundException);
  });

  it('should get seats', async () => {
    prismaMock.seats.findMany.mockResolvedValue([{ id: 1, seat_number: 5, row: 'A', is_occupied: false, room: { id: 1, name: 'Room A', capacity: 50 } }]);

    const result = await service.getSeats();

    expect(prismaMock.seats.findMany).toHaveBeenCalled();
    expect(result.length).toBe(1);
  });

  it('should update a seat', async () => {
    const dto: CreateSeatDto = { seat_number: 6, row: 'B', room_id: 1 };

    prismaMock.seats.update.mockResolvedValue({ id: 2, seat_number: 6, row: 'B', is_occupied: false, room: { id: 1, name: 'Room A', capacity: 50 } });

    const result = await service.updateSeat(2, dto);

    expect(prismaMock.seats.update).toHaveBeenCalled();
    expect(result.id).toBe(2);
  });

  it('should delete a seat', async () => {
    prismaMock.seats.findUnique.mockResolvedValue({ id: 3, seat_number: 7, row: 'C', is_occupied: false, room: { id: 1, name: 'Room A', capacity: 50 } });
    prismaMock.seats.delete.mockResolvedValue({ id: 3, seat_number: 7, row: 'C', is_occupied: false, room: { id: 1, name: 'Room A', capacity: 50 } });

    const result = await service.deleteSeat(3);

    expect(prismaMock.seats.delete).toHaveBeenCalled();
    expect(result.id).toBe(3);
  });

  it('should throw NotFoundException when deleting missing seat', async () => {
    prismaMock.seats.findUnique.mockResolvedValue(null);

    await expect(service.deleteSeat(999)).rejects.toThrow(NotFoundException);
  });

  it('should occupy a seat', async () => {
    prismaMock.seats.findUnique.mockResolvedValue({ id: 4 });
    prismaMock.seats.update.mockResolvedValue({ id: 4, seat_number: 1, row: 'A', is_occupied: true, room: { id: 1, name: 'Room A', capacity: 50 } });

    const result = await service.occupySeat(4);

    expect(prismaMock.seats.findUnique).toHaveBeenCalled();
    expect(prismaMock.seats.update).toHaveBeenCalled();
    expect(result.is_occupied).toBe(true);
  });

  it('should throw NotFoundException when occupying missing seat', async () => {
    prismaMock.seats.findUnique.mockResolvedValue(null);

    await expect(service.occupySeat(999)).rejects.toThrow(NotFoundException);
  });

  it('should free a seat', async () => {
    prismaMock.seats.findUnique.mockResolvedValue({ id: 5 });
    prismaMock.seats.update.mockResolvedValue({ id: 5, seat_number: 2, row: 'A', is_occupied: false, room: { id: 1, name: 'Room A', capacity: 50 } });

    const result = await service.freeSeat(5);

    expect(prismaMock.seats.findUnique).toHaveBeenCalled();
    expect(prismaMock.seats.update).toHaveBeenCalled();
    expect(result.is_occupied).toBe(false);
  });

  it('should throw NotFoundException when freeing missing seat', async () => {
    prismaMock.seats.findUnique.mockResolvedValue(null);

    await expect(service.freeSeat(999)).rejects.toThrow(NotFoundException);
  });
});
