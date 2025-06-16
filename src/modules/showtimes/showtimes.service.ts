import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateShowtimeDto, ShowtimeBaseDto } from './dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ShowtimesService {
  constructor(private prisma: PrismaService) { }

  async getShowtimes(): Promise<ShowtimeBaseDto[]> {
    const data = await this.prisma.showtimes.findMany({
      select: {
        id: true,
        movie_id: true,
        room_id: true,
        start_time: true,
      },
    });

    const showTimes: ShowtimeBaseDto[] = data.map(showtime => ({
      ...showtime,
      id: Number(showtime.id),
      movie_id: Number(showtime.movie_id),
      room_id: Number(showtime.room_id),
    }));

    return showTimes.map(showtime => plainToInstance(ShowtimeBaseDto, showtime));
  }

  async getShowtimeById(id: number): Promise<ShowtimeBaseDto> {
    const data = await this.prisma.showtimes.findUnique({
      where: { id },
    });

    if (!data) {
      throw new NotFoundException(`Showtime with ID ${id} not found`);
    }

    const showtime: ShowtimeBaseDto = {
      ...data,
      id: Number(data.id),
      movie_id: Number(data.movie_id),
      room_id: Number(data.room_id),
    };

    return plainToInstance(ShowtimeBaseDto, showtime);
  }

  async createShowtime(dto: CreateShowtimeDto): Promise<ShowtimeBaseDto> {
    const newShowtime = await this.prisma.showtimes.create({
      data: {
        movie_id: dto.movie_id,
        room_id: dto.room_id,
        start_time: dto.start_time,
      },
    });

    const showtime: ShowtimeBaseDto = {
      ...newShowtime,
      id: Number(newShowtime.id),
      movie_id: Number(newShowtime.movie_id),
      room_id: Number(newShowtime.room_id),
    };

    return plainToInstance(ShowtimeBaseDto, showtime);
  }

  async updateShowtime(id: number, dto: CreateShowtimeDto): Promise<ShowtimeBaseDto> {
    const updated = await this.prisma.showtimes.update({
      where: { id },
      data: {
        movie_id: dto.movie_id,
        room_id: dto.room_id,
        start_time: dto.start_time,
      },
    });

    const showtime: ShowtimeBaseDto = {
      ...updated,
      id: Number(updated.id),
      movie_id: Number(updated.movie_id),
      room_id: Number(updated.room_id),
    };

    return plainToInstance(ShowtimeBaseDto, showtime);
  }

  async deleteShowtime(id: number): Promise<ShowtimeBaseDto> {
    const existing = await this.prisma.showtimes.findUnique({ where: { id } });

    if (!existing) {
      throw new NotFoundException(`Showtime with ID ${id} not found`);
    }

    await this.prisma.showtimes.delete({ where: { id } });

    const showtime: ShowtimeBaseDto = {
      ...existing,
      id: Number(existing.id),
      movie_id: Number(existing.movie_id),
      room_id: Number(existing.room_id),
    };

    return plainToInstance(ShowtimeBaseDto, showtime);
  }
}
