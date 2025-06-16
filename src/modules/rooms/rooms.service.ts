import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateRoomDto, RoomBaseDto } from './dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class RoomsService {

  constructor(private prisma: PrismaService) { }

  async getRooms(): Promise<RoomBaseDto[]> {
    const data = await this.prisma.rooms.findMany({
      select: {
        id: true,
        name: true,
        capacity: true,
      },
    });

    const rooms: RoomBaseDto[] = data.map(room => ({
      ...room,
      id: Number(room.id),
    }));

    return rooms.map(room => plainToInstance(RoomBaseDto, room));
  }

  async getRoomById(id: number): Promise<RoomBaseDto> {
    const data = await this.prisma.rooms.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        capacity: true,
      },
    });

    if (!data) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }

    const room: RoomBaseDto = {
      ...data,
      id: Number(data.id),
    };

    return plainToInstance(RoomBaseDto, room);
  }

  async createRoom(dto: CreateRoomDto): Promise<RoomBaseDto> {
    const newRoom = await this.prisma.rooms.create({
      data: {
        name: dto.name,
        capacity: dto.capacity,
      },
      select: {
        id: true,
        name: true,
        capacity: true,
      },
    });

    const room: RoomBaseDto = {
      ...newRoom,
      id: Number(newRoom.id),
    };

    return plainToInstance(RoomBaseDto, room);
  }

  async updateRoom(id: number, dto: CreateRoomDto): Promise<RoomBaseDto> {
    const updated = await this.prisma.rooms.update({
      where: { id },
      data: {
        name: dto.name,
        capacity: dto.capacity,
      },
      select: {
        id: true,
        name: true,
        capacity: true,
      },
    });

    const room: RoomBaseDto = {
      ...updated,
      id: Number(updated.id),
    };

    return plainToInstance(RoomBaseDto, room);
  }

  async deleteRoom(id: number): Promise<RoomBaseDto> {
    const existing = await this.prisma.rooms.findUnique({ where: { id } });

    if (!existing) {
      throw new NotFoundException(`Room with ID ${id} not found`);
    }

    await this.prisma.rooms.delete({ where: { id } });

    const room: RoomBaseDto = {
      ...existing,
      id: Number(existing.id),
    };

    return plainToInstance(RoomBaseDto, room);
  }
}
