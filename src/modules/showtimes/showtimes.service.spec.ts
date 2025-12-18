import { Test, TestingModule } from '@nestjs/testing';
import { ShowtimesService } from './showtimes.service';
import { PrismaService } from 'src/prisma.service';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { NotFoundException } from '@nestjs/common';

describe('ShowtimesService', () => {
  let service: ShowtimesService;

  const prismaMock = {
    showtimes: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShowtimesService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<ShowtimesService>(ShowtimesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a showtime', async () => {
    const dto: CreateShowtimeDto = {
      movie_id: 1,
      room_id: 2,
      start_time: new Date('2025-12-17T10:00:00Z'),
      format: 'IMAX',
      price: 12.5,
    };

    prismaMock.showtimes.create.mockResolvedValue({
      id: 1,
      movie: { id: 1, title: 'Inception', duration: 148 },
      room: { id: 2, name: 'Room A', capacity: 50 },
      start_time: dto.start_time,
      format: dto.format,
      price: dto.price,
    });

    const result = await service.createShowtime(dto);

    expect(prismaMock.showtimes.create).toHaveBeenCalled();
    expect(result.movie.id).toBe(1);
  });

  it('should get a showtime by id', async () => {
    prismaMock.showtimes.findUnique.mockResolvedValue({
      id: 1,
      movie: { id: 1, title: 'Inception', duration: 148 },
      room: { id: 2, name: 'Room A', capacity: 50 },
      start_time: new Date('2025-12-17T10:00:00Z'),
      format: 'IMAX',
      price: 12.5,
    });

    const result = await service.getShowtimeById(1);

    expect(prismaMock.showtimes.findUnique).toHaveBeenCalled();
    expect(result.id).toBe(1);
  });

  it('should throw NotFoundException when showtime not found by id', async () => {
    prismaMock.showtimes.findUnique.mockResolvedValue(null);

    await expect(service.getShowtimeById(999)).rejects.toThrow(NotFoundException);
  });

  it('should get showtimes', async () => {
    prismaMock.showtimes.findMany.mockResolvedValue([
      {
        id: 1,
        movie: { id: 1, title: 'Inception', duration: 148 },
        room: { id: 2, name: 'Room A', capacity: 50 },
        start_time: new Date('2025-12-17T10:00:00Z'),
        format: 'IMAX',
        price: 12.5,
      },
    ]);

    const result = await service.getShowtimes();

    expect(prismaMock.showtimes.findMany).toHaveBeenCalled();
    expect(result.length).toBe(1);
  });

  it('should update a showtime', async () => {
    const dto: CreateShowtimeDto = {
      movie_id: 1,
      room_id: 2,
      start_time: new Date('2025-12-17T12:00:00Z'),
      format: '2D',
      price: 8.0,
    };

    prismaMock.showtimes.update.mockResolvedValue({
      id: 2,
      movie: { id: 1, title: 'Inception', duration: 148 },
      room: { id: 2, name: 'Room A', capacity: 50 },
      start_time: dto.start_time,
      format: dto.format,
      price: dto.price,
    });

    const result = await service.updateShowtime(2, dto);

    expect(prismaMock.showtimes.update).toHaveBeenCalled();
    expect(result.id).toBe(2);
  });

  it('should delete a showtime', async () => {
    prismaMock.showtimes.findUnique.mockResolvedValue({
      id: 3,
      movie: { id: 1, title: 'Inception', duration: 148 },
      room: { id: 2, name: 'Room A', capacity: 50 },
      start_time: new Date('2025-12-17T10:00:00Z'),
      format: 'IMAX',
      price: 12.5,
    });

    prismaMock.showtimes.delete.mockResolvedValue({
      id: 3,
      movie: { id: 1, title: 'Inception', duration: 148 },
      room: { id: 2, name: 'Room A', capacity: 50 },
      start_time: new Date('2025-12-17T10:00:00Z'),
      format: 'IMAX',
      price: 12.5,
    });

    const result = await service.deleteShowtime(3);

    expect(prismaMock.showtimes.delete).toHaveBeenCalled();
    expect(result.id).toBe(3);
  });

  it('should throw NotFoundException when deleting missing showtime', async () => {
    prismaMock.showtimes.findUnique.mockResolvedValue(null);

    await expect(service.deleteShowtime(999)).rejects.toThrow(NotFoundException);
  });

  it('should get showtimes by movie id', async () => {
    prismaMock.showtimes.findMany.mockResolvedValue([
      {
        id: 4,
        movie: { id: 2, title: 'Other', duration: 100 },
        room: { id: 3, name: 'Room B', capacity: 40 },
        start_time: new Date('2025-12-18T10:00:00Z'),
        format: '3D',
        price: 9.5,
      },
    ]);

    const result = await service.getShowtimesByMovieId(2);

    expect(prismaMock.showtimes.findMany).toHaveBeenCalled();
    expect(result.length).toBe(1);
  });

  it('should throw NotFoundException when no showtimes for movie', async () => {
    prismaMock.showtimes.findMany.mockResolvedValue([]);

    await expect(service.getShowtimesByMovieId(99)).rejects.toThrow(NotFoundException);
  });
});
