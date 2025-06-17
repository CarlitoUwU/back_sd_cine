import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateSeatDto, SeatBaseDto } from './dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class SeatsService {
  constructor(private prisma: PrismaService) { }

  async getSeats(): Promise<SeatBaseDto[]> {
    const data = await this.prisma.seats.findMany();

    const seats: SeatBaseDto[] = data.map(seat => ({
      ...seat,
      id: Number(seat.id),
      room_id: Number(seat.room_id),
    }));

    return seats.map(seat => plainToInstance(SeatBaseDto, seat));
  }

  async getSeatById(id: number): Promise<SeatBaseDto> {
    const data = await this.prisma.seats.findUnique({ where: { id } });
    if (!data) throw new NotFoundException(`Seat with ID ${id} not found`);

    const seat: SeatBaseDto = {
      ...data,
      id: Number(data.id),
      room_id: Number(data.room_id),
    };

    return plainToInstance(SeatBaseDto, seat);
  }

  async createSeat(dto: CreateSeatDto): Promise<SeatBaseDto> {
    const newSeat = await this.prisma.seats.create({ data: dto });

    const seat: SeatBaseDto = {
      ...newSeat,
      id: Number(newSeat.id),
      room_id: Number(newSeat.room_id),
    };

    return plainToInstance(SeatBaseDto, seat);
  }

  async updateSeat(id: number, dto: CreateSeatDto): Promise<SeatBaseDto> {
    const updated = await this.prisma.seats.update({ where: { id }, data: dto });

    const seat: SeatBaseDto = {
      ...updated,
      id: Number(updated.id),
      room_id: Number(updated.room_id),
    };

    return plainToInstance(SeatBaseDto, seat);
  }

  async deleteSeat(id: number): Promise<SeatBaseDto> {
    const existing = await this.prisma.seats.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Seat with ID ${id} not found`);

    await this.prisma.seats.delete({ where: { id } });

    const seat: SeatBaseDto = {
      ...existing,
      id: Number(existing.id),
      room_id: Number(existing.room_id),
    };

    return plainToInstance(SeatBaseDto, seat);
  }
}
