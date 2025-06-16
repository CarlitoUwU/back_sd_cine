import { Injectable, NotFoundException } from '@nestjs/common';
import { UserBaseDto } from './dto';
import { CreateUserDto } from './dto/index';
import { PrismaService } from 'src/prisma.service';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UsersServices {

  constructor(private prisma: PrismaService) { }

  async getUsers(): Promise<UserBaseDto[]> {
    const data = await this.prisma.users.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    const users: UserBaseDto[] = data.map(user => ({
      id: Number(user.id),
      name: user.name,
      email: user.email,
    }));

    return users.map(user => plainToInstance(UserBaseDto, user));
  }

  async getUserById(id: number): Promise<UserBaseDto> {
    const data = await this.prisma.users.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    if (!data) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const user: UserBaseDto = {
      id: Number(data.id),
      name: data.name,
      email: data.email,
    };

    return plainToInstance(UserBaseDto, user);
  }

  async createUser(obj: CreateUserDto): Promise<UserBaseDto> {
    const data = await this.prisma.users.create({
      data: {
        name: obj.name,
        email: obj.email,
        password: obj.password,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    const user: UserBaseDto = {
      id: Number(data.id),
      name: data.name,
      email: data.email,
    };

    return plainToInstance(UserBaseDto, user);
  }

  async updateUser(id: number, obj: CreateUserDto): Promise<UserBaseDto> {
    const data = await this.prisma.users.update({
      where: { id },
      data: {
        name: obj.name,
        email: obj.email,
        password: obj.password,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    const user: UserBaseDto = {
      id: Number(data.id),
      name: data.name,
      email: data.email,
    };

    return plainToInstance(UserBaseDto, user);
  }

  async deleteUser(id: number): Promise<UserBaseDto> {
    const user = await this.prisma.users.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.prisma.users.delete({
      where: { id },
    });

    const deletedUser: UserBaseDto = {
      id: Number(user.id),
      name: user.name,
      email: user.email,
    };

    return plainToInstance(UserBaseDto, deletedUser);
  }

}