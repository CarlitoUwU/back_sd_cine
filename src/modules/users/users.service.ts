import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UserBaseDto } from './dto';
import { CreateUserDto } from './dto/index';
import { PrismaService } from 'src/prisma.service';
import { plainToInstance } from 'class-transformer';
import { MailsService } from '../mails/mails.service';
import { RedisService } from '../../common/redis/redis.service';

@Injectable()
export class UsersServices {

  constructor(
    private prisma: PrismaService,
    private readonly mailsService: MailsService,
    private readonly redisService: RedisService,
  ) { }

  async getUsers(): Promise<UserBaseDto[]> {
    const data = await this.prisma.users.findMany({
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
      },
    });

    const users: UserBaseDto[] = data.map(user => ({
      id: Number(user.id),
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    }));

    return users.map(user => plainToInstance(UserBaseDto, user));
  }

  async getUserById(id: number): Promise<UserBaseDto> {
    const data = await this.prisma.users.findUnique({
      where: { id },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
      },
    });
    if (!data) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const user: UserBaseDto = {
      id: Number(data.id),
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
    };

    return plainToInstance(UserBaseDto, user);
  }

  async createUser(obj: CreateUserDto): Promise<UserBaseDto> {
    const data = await this.prisma.users.create({
      data: {
        first_name: obj.first_name,
        last_name: obj.last_name,
        email: obj.email,
        password: obj.password,
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
      },
    });

    const user: UserBaseDto = {
      id: Number(data.id),
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
    };

    return plainToInstance(UserBaseDto, user);
  }

  async updateUser(id: number, obj: CreateUserDto): Promise<UserBaseDto> {
    const data = await this.prisma.users.update({
      where: { id },
      data: {
        first_name: obj.first_name,
        last_name: obj.last_name,
        email: obj.email,
        password: obj.password,
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
      },
    });

    const user: UserBaseDto = {
      id: Number(data.id),
      first_name: data.first_name,
      last_name: data.last_name,
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
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    };

    return plainToInstance(UserBaseDto, deletedUser);
  }

  async login(email: string, password: string): Promise<UserBaseDto> {
    const data = await this.prisma.users.findUnique({
      where: {
        email,
        password,
      },
    })

    if (!data) {
      throw new NotFoundException('User not found');
    }
    const user: UserBaseDto = {
      id: Number(data.id),
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
    }

    return user;
  }

  async createCodeResetPassword(email: string) {
    const user = await this.prisma.users.findUnique({
      where: { email },
      select: {
        first_name: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with email '${email}' not found`);
    }

    // Generar código y guardarlo en Redis
    const resetCode = await this.redisService.generateResetCode(email);

    // Enviar email con el código
    await this.mailsService.sendUserResetPassword(user.first_name, email, parseInt(resetCode));

    return {
      message: 'Reset password code sent successfully',
      email: email,
      expiresIn: '10 minutes',
    };
  }

  async verifyResetCode(email: string, code: number) {
    const user = await this.prisma.users.findUnique({
      where: { email },
      select: {
        first_name: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with email '${email}' not found`);
    }

    // Verificar código en Redis
    const isValid = await this.redisService.verifyResetCode(email, code.toString());

    if (!isValid) {
      throw new BadRequestException('Invalid or expired reset code');
    }

    return {
      message: 'Reset code verified successfully',
      email: email,
      verified: true,
      validFor: '30 minutes',
    };
  }

  async resetPassword(email: string, newPassword: string) {
    const user = await this.prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException(`User with email '${email}' not found`);
    }

    // Verificar que el usuario haya verificado su código recientemente
    const isCodeVerified = await this.redisService.isResetCodeVerified(email);

    if (!isCodeVerified) {
      throw new BadRequestException(
        'You must verify your reset code before changing your password. Please request a new reset code.',
      );
    }

    const updatedUser = await this.prisma.users.update({
      where: { email },
      data: {
        password: newPassword,
      },
    });

    // Limpiar la verificación de Redis después del reseteo exitoso
    await this.redisService.clearResetVerification(email);

    const newUser: UserBaseDto = {
      id: Number(updatedUser.id),
      first_name: updatedUser.first_name,
      last_name: updatedUser.last_name,
      email: updatedUser.email,
    }

    return {
      message: 'Password reset successfully',
      email: email,
      user: plainToInstance(UserBaseDto, newUser),
    };
  }
}