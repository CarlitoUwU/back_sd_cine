import { Test, TestingModule } from '@nestjs/testing';
import { RoomsService } from './rooms.service';
import { PrismaService } from 'src/prisma.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('RoomsService', () => {
  let service: RoomsService;

  const prismaMock = {
    rooms: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    seats: {
      createMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomsService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<RoomsService>(RoomsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a room and populate seats', async () => {
    const dto: CreateRoomDto = { name: 'Room A', capacity: 50 };

    prismaMock.rooms.create.mockResolvedValue({ id: 1, name: dto.name, capacity: dto.capacity });

    const result = await service.createRoom(dto);

    expect(prismaMock.rooms.create).toHaveBeenCalled();
    expect(prismaMock.seats.createMany).toHaveBeenCalled();
    expect(result.name).toBe(dto.name);
  });

  it('should throw BadRequestException when capacity is not multiple of 10', async () => {
    const dto: CreateRoomDto = { name: 'Bad Room', capacity: 23 };

    await expect(service.createRoom(dto)).rejects.toThrow(BadRequestException);
  });

  it('should get a room by id', async () => {
    prismaMock.rooms.findUnique.mockResolvedValue({ id: 1, name: 'Room A', capacity: 50 });

    const result = await service.getRoomById(1);

    expect(prismaMock.rooms.findUnique).toHaveBeenCalled();
    expect(result.id).toBe(1);
  });

  it('should get rooms', async () => {
    prismaMock.rooms.findMany.mockResolvedValue([{ id: 1, name: 'Room A', capacity: 50 }]);

    const result = await service.getRooms();

    expect(prismaMock.rooms.findMany).toHaveBeenCalled();
    expect(result.length).toBe(1);
  });

  it('should update a room', async () => {
    const dto: CreateRoomDto = { name: 'Updated Room', capacity: 40 };

    prismaMock.rooms.update.mockResolvedValue({ id: 2, name: dto.name, capacity: dto.capacity });

    const result = await service.updateRoom(2, dto);

    expect(prismaMock.rooms.update).toHaveBeenCalled();
    expect(result.id).toBe(2);
  });

  it('should delete a room', async () => {
    prismaMock.rooms.findUnique.mockResolvedValue({ id: 3, name: 'Del Room', capacity: 30 });
    prismaMock.rooms.delete.mockResolvedValue({ id: 3, name: 'Del Room', capacity: 30 });

    const result = await service.deleteRoom(3);

    expect(prismaMock.rooms.delete).toHaveBeenCalled();
    expect(result.id).toBe(3);
  });

  it('should throw NotFoundException if room not found by id', async () => {
    prismaMock.rooms.findUnique.mockResolvedValue(null);

    await expect(service.getRoomById(999)).rejects.toThrow(NotFoundException);
  });

  it('should throw NotFoundException when deleting a non-existing room', async () => {
    prismaMock.rooms.findUnique.mockResolvedValue(null);

    await expect(service.deleteRoom(999)).rejects.toThrow(NotFoundException);
  });
});
