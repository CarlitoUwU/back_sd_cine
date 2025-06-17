import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateSeatDto, SeatBaseDto } from './dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class SeatsService {
  constructor(private prisma: PrismaService) { }

  async getSeats(): Promise<SeatBaseDto[]> {
    const data = await this.prisma.seats.findMany({
      include: {
        room: true
      },
    });

    const seats: SeatBaseDto[] = data.map(this.toSeatDto);

    return seats;
  }

  async getSeatById(id: number): Promise<SeatBaseDto> {
    const data = await this.prisma.seats.findUnique({
      where: { id },
      include: {
        room: true
      },
    });
    if (!data) throw new NotFoundException(`Seat with ID ${id} not found`);

    const seat: SeatBaseDto = this.toSeatDto(data);

    return seat;
  }

  async createSeat(dto: CreateSeatDto): Promise<SeatBaseDto> {
    // 1. Validar que el seat_number esté entre 1 y 10
    if (dto.seat_number < 1 || dto.seat_number > 10) {
      throw new BadRequestException('Seat number must be between 1 and 10.');
    }

    // 2. Obtener room y validar existencia
    const room = await this.prisma.rooms.findUnique({
      where: { id: dto.room_id },
    });

    if (!room) {
      throw new NotFoundException(`Room with ID ${dto.room_id} not found.`);
    }

    // 3. Calcular cuántas filas puede tener (capacidad / 10)
    const maxRows = room.capacity / 10;
    const allowedRows = Array.from({ length: maxRows }, (_, i) =>
      String.fromCharCode(65 + i) // 'A', 'B', ..., según la cantidad de filas
    );

    if (!allowedRows.includes(dto.row.toUpperCase())) {
      throw new BadRequestException(
        `Row must be one of the following: ${allowedRows.join(', ')}.`
      );
    }

    // 4. Verificar que no exista el mismo seat_number y row en ese room
    const existingSeat = await this.prisma.seats.findFirst({
      where: {
        room_id: dto.room_id,
        seat_number: dto.seat_number,
        row: dto.row.toUpperCase(),
      },
    });

    if (existingSeat) {
      throw new BadRequestException(
        `Seat with number ${dto.seat_number} and row ${dto.row} already exists in room ${dto.room_id}.`
      );
    }

    const newSeat = await this.prisma.seats.create({
      data: {
        seat_number: dto.seat_number,
        room_id: dto.room_id,
        row: dto.row,
      },
      include: {
        room: true,
      },
    });

    const seat: SeatBaseDto = this.toSeatDto(newSeat);

    return seat;
  }

  async updateSeat(id: number, dto: CreateSeatDto): Promise<SeatBaseDto> {
    const updated = await this.prisma.seats.update({
      where: { id },
      include: {
        room: true
      },
      data: {
        seat_number: dto.seat_number,
        room_id: dto.room_id,
        row: dto.row,
        is_occupied: dto.is_occupied,
      }
    });

    const seat: SeatBaseDto = this.toSeatDto(updated);

    return seat;
  }

  async deleteSeat(id: number): Promise<SeatBaseDto> {
    const existing = await this.prisma.seats.findUnique({
      where: { id },
      include: {
        room: true
      },
    });
    if (!existing) throw new NotFoundException(`Seat with ID ${id} not found`);

    await this.prisma.seats.delete({ where: { id } });

    const seat: SeatBaseDto = this.toSeatDto(existing);

    return seat;
  }

  async occupySeat(id: number): Promise<SeatBaseDto> {
    const data = await this.prisma.seats.findUnique({ where: { id } });
    if (!data) {
      throw new NotFoundException(`Seat with ID ${id} not found`);
    }

    const updatedSeat = await this.prisma.seats.update({
      where: { id },
      data: { is_occupied: true },
      include: {
        room: true
      },
    });

    const seat: SeatBaseDto = this.toSeatDto(updatedSeat);

    return seat;
  }

  async freeSeat(id: number): Promise<SeatBaseDto> {
    const data = await this.prisma.seats.findUnique({ where: { id } });
    if (!data) {
      throw new NotFoundException(`Seat with ID ${id} not found`);
    }

    const updatedSeat = await this.prisma.seats.update({
      where: { id },
      data: { is_occupied: false },
      include: {
        room: true
      },
    });

    const seat: SeatBaseDto = this.toSeatDto(updatedSeat);

    return seat;
  }

  private toSeatDto = (data: any): SeatBaseDto => {
    return plainToInstance(SeatBaseDto, {
      id: Number(data.id),
      room: {
        ...data.room,
        id: Number(data.room.id),
      },
      seat_number: data.seat_number,
      is_occupied: data.is_occupied,
      row: data.row,
    });
  }
}
