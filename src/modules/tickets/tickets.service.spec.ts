import { Test, TestingModule } from '@nestjs/testing';
import { TicketsService } from './tickets.service';
import { PrismaService } from 'src/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('TicketsService', () => {
  let service: TicketsService;

  const prismaMock = {
    $queryRaw: jest.fn(),
    $transaction: jest.fn(),
    showtimes: { findUnique: jest.fn(), findMany: jest.fn() },
    tickets: { findFirst: jest.fn(), findMany: jest.fn(), findUnique: jest.fn() },
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketsService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<TicketsService>(TicketsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a ticket (happy path)', async () => {
    const dto: CreateTicketDto = { user_id: 1, showtime_id: 1, row: 'A', seat_number: 5 };

    prismaMock.$queryRaw.mockResolvedValue([{ mensaje: 'Compra con éxito' }]);
    prismaMock.showtimes.findUnique.mockResolvedValue({ id: 1, room_id: 2 });
    prismaMock.tickets.findFirst.mockResolvedValue({
      id: 1,
      user: { id: 1, first_name: 'John', last_name: 'Doe', email: 'john@example.com' },
      showtime: { id: 1, start_time: new Date(), format: 'IMAX', price: 10.5, movie: { id: 1, title: 'Inception', duration: 148 }, room: { id: 2, name: 'Room A', capacity: 50 } },
      seat: { id: 1, seat_number: 5, row: 'A', is_occupied: false, room: { id: 2, name: 'Room A', capacity: 50 } },
      purchase_date: new Date(),
    });

    const result = await service.createTicket(dto);

    expect(prismaMock.$queryRaw).toHaveBeenCalled();
    expect(prismaMock.showtimes.findUnique).toHaveBeenCalledWith({ where: { id: dto.showtime_id }, select: { room_id: true } });
    expect(prismaMock.tickets.findFirst).toHaveBeenCalled();
    expect(result.id).toBe(1);
  });

  it('should throw BadRequestException when stored procedure returns failure', async () => {
    const dto: CreateTicketDto = { user_id: 1, showtime_id: 1, row: 'A', seat_number: 5 };

    prismaMock.$queryRaw.mockResolvedValue([{ mensaje: 'Error: no hay asientos' }]);

    await expect(service.createTicket(dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException when stored procedure returns no mensaje', async () => {
    const dto: CreateTicketDto = { user_id: 1, showtime_id: 1, row: 'A', seat_number: 5 };

    prismaMock.$queryRaw.mockResolvedValue([]);

    await expect(service.createTicket(dto)).rejects.toThrow(BadRequestException);
  });

  it('should throw Error when showtime not found after successful purchase', async () => {
    const dto: CreateTicketDto = {
      user_id: 1,
      showtime_id: 1,
      row: 'A',
      seat_number: 5,
    };

    prismaMock.$queryRaw.mockResolvedValue([
      { mensaje: 'Compra con éxito' },
    ]);

    prismaMock.showtimes.findUnique.mockResolvedValue(null);

    await expect(service.createTicket(dto)).rejects.toThrow(
      'Showtime no existe',
    );
  });

  it('should throw Error when showtime does not exist in createMultipleTickets', async () => {
    const dtos: CreateTicketDto[] = [
      {
        user_id: 1,
        showtime_id: 99,
        row: 'A',
        seat_number: 1,
      },
    ];

    prismaMock.$transaction.mockImplementation(async (cb) => {
      return cb(prismaMock);
    });

    prismaMock.$queryRaw.mockResolvedValue([
      { mensaje: 'Compra con éxito' },
    ]);

    prismaMock.showtimes.findUnique.mockResolvedValue(null);

    await expect(
      service.createMultipleTickets(dtos),
    ).rejects.toThrow('Showtime no existe');
  });

  it('should throw Error when ticket not found after purchase', async () => {
    const dto: CreateTicketDto = { user_id: 1, showtime_id: 1, row: 'A', seat_number: 5 };

    prismaMock.$queryRaw.mockResolvedValue([{ mensaje: 'Compra con éxito' }]);
    prismaMock.showtimes.findUnique.mockResolvedValue({ id: 1, room_id: 2 });
    prismaMock.tickets.findFirst.mockResolvedValue(null);

    await expect(service.createTicket(dto)).rejects.toThrow(Error);
  });

  it('should create multiple tickets (happy path)', async () => {
    const dtos: CreateTicketDto[] = [{ user_id: 1, showtime_id: 1, row: 'A', seat_number: 5 }];

    const txMock: any = {
      $queryRaw: jest.fn().mockResolvedValue([{ mensaje: 'Compra con éxito' }]),
      showtimes: { findUnique: jest.fn().mockResolvedValue({ id: 1, room_id: 2 }) },
      tickets: { findFirst: jest.fn().mockResolvedValue({ id: 1, user: { id: 1, first_name: 'John', last_name: 'Doe', email: 'john@example.com' }, showtime: { id: 1, start_time: new Date(), format: 'IMAX', price: 10.5, movie: { id: 1, title: 'Inception', duration: 148 }, room: { id: 2, name: 'Room A', capacity: 50 } }, seat: { id: 1, seat_number: 5, row: 'A', is_occupied: false, room: { id: 2, name: 'Room A', capacity: 50 } }, purchase_date: new Date() }) },
    };

    prismaMock.$transaction.mockImplementation(async (fn: any) => {
      return await fn(txMock);
    });

    const result = await service.createMultipleTickets(dtos);

    expect(prismaMock.$transaction).toHaveBeenCalled();
    expect(result.length).toBe(1);
  });

  it('should throw BadRequestException when bulk purchase has an error', async () => {
    const dtos: CreateTicketDto[] = [{ user_id: 1, showtime_id: 1, row: 'A', seat_number: 5 }];

    const txMock: any = {
      $queryRaw: jest.fn().mockResolvedValue([{ mensaje: 'Error: fail' }]),
      showtimes: { findUnique: jest.fn().mockResolvedValue({ id: 1, room_id: 2 }) },
      tickets: { findFirst: jest.fn() },
    };

    prismaMock.$transaction.mockImplementation(async (fn: any) => {
      return await fn(txMock);
    });

    await expect(service.createMultipleTickets(dtos)).rejects.toThrow(BadRequestException);
  });

  it('should get all tickets', async () => {
    prismaMock.tickets.findMany.mockResolvedValue([{ id: 1, user: { id: 1, first_name: 'John', last_name: 'Doe', email: 'john@example.com' }, showtime: { id: 1, start_time: new Date(), format: 'IMAX', price: 10.5, movie: { id: 1, title: 'Inception', duration: 148 }, room: { id: 2, name: 'Room A', capacity: 50 } }, seat: { id: 1, seat_number: 5, row: 'A', is_occupied: false, room: { id: 2, name: 'Room A', capacity: 50 } }, purchase_date: new Date() }]);

    const result = await service.getAllTickets();

    expect(prismaMock.tickets.findMany).toHaveBeenCalled();
    expect(result.length).toBe(1);
  });

  it('should get ticket by id', async () => {
    prismaMock.tickets.findUnique.mockResolvedValue({ id: 2, user: { id: 1, first_name: 'John', last_name: 'Doe', email: 'john@example.com' }, showtime: { id: 1, start_time: new Date(), format: 'IMAX', price: 10.5, movie: { id: 1, title: 'Inception', duration: 148 }, room: { id: 2, name: 'Room A', capacity: 50 } }, seat: { id: 1, seat_number: 5, row: 'A', is_occupied: false, room: { id: 2, name: 'Room A', capacity: 50 } }, purchase_date: new Date() });

    const result = await service.getTicketById(2);

    expect(prismaMock.tickets.findUnique).toHaveBeenCalled();
    expect(result.id).toBe(2);
  });

  it('should throw NotFoundException when ticket by id missing', async () => {
    prismaMock.tickets.findUnique.mockResolvedValue(null);

    await expect(service.getTicketById(999)).rejects.toThrow(NotFoundException);
  });

  it('should get tickets by user', async () => {
    prismaMock.tickets.findMany.mockResolvedValue([{ id: 3, user: { id: 2, first_name: 'Jane', last_name: 'Smith', email: 'jane@example.com' }, showtime: { id: 1, start_time: new Date(), format: 'IMAX', price: 10.5, movie: { id: 1, title: 'Inception', duration: 148 }, room: { id: 2, name: 'Room A', capacity: 50 } }, seat: { id: 2, seat_number: 6, row: 'B', is_occupied: false, room: { id: 2, name: 'Room A', capacity: 50 } }, purchase_date: new Date() }]);

    const result = await service.getTicketsByUser(2);

    expect(prismaMock.tickets.findMany).toHaveBeenCalled();
    expect(result.length).toBe(1);
  });

  it('should get tickets by showtime', async () => {
    prismaMock.tickets.findMany.mockResolvedValue([{ id: 4, user: { id: 3, first_name: 'Joe', last_name: 'Bloggs', email: 'joe@example.com' }, showtime: { id: 2, start_time: new Date(), format: '2D', price: 8.0, movie: { id: 2, title: 'Other', duration: 120 }, room: { id: 3, name: 'Room B', capacity: 40 } }, seat: { id: 3, seat_number: 7, row: 'C', is_occupied: false, room: { id: 3, name: 'Room B', capacity: 40 } }, purchase_date: new Date() }]);

    const result = await service.getTicketsByShowtime(2);

    expect(prismaMock.tickets.findMany).toHaveBeenCalled();
    expect(result.length).toBe(1);
  });
});
