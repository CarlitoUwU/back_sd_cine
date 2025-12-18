import { Test, TestingModule } from '@nestjs/testing';
import { UsersServices } from './users.service';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { MailsService } from '../mails/mails.service';
import { RedisService } from 'src/common/redis/redis.service';

describe('UsersService', () => {
  let service: UsersServices;

  const prismaMock = {
    users: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mailsServiceMock = {
    sendWelcomeMail: jest.fn(),
    sendUserResetPassword: jest.fn(),
  };

  const redisServiceMock = {
    generateResetCode: jest.fn(),
    verifyResetCode: jest.fn(),
    isResetCodeVerified: jest.fn(),
    clearResetVerification: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersServices,
        { provide: PrismaService, useValue: prismaMock },
        { provide: MailsService, useValue: mailsServiceMock },
        { provide: RedisService, useValue: redisServiceMock },
      ],
    }).compile();

    service = module.get<UsersServices>(UsersServices);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const dto: CreateUserDto = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'johndoe@gmail.com',
      password: 'Password123@',
    };

    prismaMock.users.create.mockResolvedValue({
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      email: 'johndoe@gmail.com',
    });

    const result = await service.createUser(dto);

    expect(prismaMock.users.create).toHaveBeenCalled();
    expect(result.email).toBe(dto.email);
  });

  it('should get a user by id', async () => {
    prismaMock.users.findUnique.mockResolvedValue({
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      email: 'johndoe@gmail.com',
    });

    const result = await service.getUserById(1);

    expect(prismaMock.users.findUnique).toHaveBeenCalled();
    expect(result.id).toBe(1);
  });

  it('should get users', async () => {
    prismaMock.users.findMany.mockResolvedValue([
      {
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        email: 'johndoe@gmail.com',
      },
      {
        id: 2,
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'janesmith@gmail.com',
      },
    ]);

    const result = await service.getUsers();

    expect(prismaMock.users.findMany).toHaveBeenCalled();
    expect(result.length).toBe(2);
  });

  it('should update a user', async () => {
    const dto: CreateUserDto = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'johndoe@gmail.com',
      password: 'Password123@',
    };

    prismaMock.users.update.mockResolvedValue({
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      email: 'johndoe@gmail.com',
    });

    const result = await service.updateUser(1, dto);

    expect(prismaMock.users.update).toHaveBeenCalled();
    expect(result.id).toBe(1);
  });

  it('should delete a user', async () => {
    prismaMock.users.findUnique.mockResolvedValue({
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      email: 'johndoe@gmail.com',
    });

    prismaMock.users.delete.mockResolvedValue({
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      email: 'johndoe@gmail.com',
    });

    const result = await service.deleteUser(1);

    expect(prismaMock.users.delete).toHaveBeenCalled();
    expect(result.id).toBe(1);
  });

  it('should login a user', async () => {
    prismaMock.users.findUnique.mockResolvedValue({
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      email: 'johndoe@gmail.com',
      password: 'Password123@',
    });

    const result = await service.login('johndoe@gmail.com', 'Password123@');

    expect(prismaMock.users.findUnique).toHaveBeenCalled();
    expect(result.email).toBe('johndoe@gmail.com');
  });

  it('should create code reset password', async () => {
    prismaMock.users.findUnique.mockResolvedValue({
      first_name: 'John',
    });

    redisServiceMock.generateResetCode.mockResolvedValue('123456');

    await service.createCodeResetPassword('johndoe@gmail.com');

    expect(redisServiceMock.generateResetCode).toHaveBeenCalled();
    expect(mailsServiceMock.sendUserResetPassword).toHaveBeenCalled();
  });

  it('should verify code reset password', async () => {
    prismaMock.users.findUnique.mockResolvedValue({
      first_name: 'John',
    });

    redisServiceMock.verifyResetCode.mockResolvedValue(true);

    const result = await service.verifyResetCode(
      'johndoe@gmail.com',
      123456,
    );

    expect(result.verified).toBe(true);
  });

  it('should reset password', async () => {
    prismaMock.users.findUnique.mockResolvedValue({
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      email: 'johndoe@gmail.com',
    });

    redisServiceMock.isResetCodeVerified.mockResolvedValue(true);
    prismaMock.users.update.mockResolvedValue({
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      email: 'johndoe@gmail.com',
    });

    await service.resetPassword(
      'johndoe@gmail.com',
      'NewPassword123@',
    );

    expect(prismaMock.users.update).toHaveBeenCalled();
    expect(redisServiceMock.clearResetVerification).toHaveBeenCalled();
  });

  it('should throw NotFoundException if user not found', async () => {
    prismaMock.users.findUnique.mockResolvedValue(null);

    await expect(service.getUserById(999)).rejects.toThrow(NotFoundException);
  });

  it('should throw NotFoundException when deleting a non-existing user', async () => {
    prismaMock.users.findUnique.mockResolvedValue(null);

    await expect(service.deleteUser(999)).rejects.toThrow(NotFoundException);
  });

  it('should throw NotFoundException when login a non-existing user', async () => {
    prismaMock.users.findUnique.mockResolvedValue(null);

    await expect(service.login('johndoe@gmail.com', 'Password123@')).rejects.toThrow(NotFoundException);
  });

  it('should throw NotFoundException when create code reset password a non-existing user', async () => {
    prismaMock.users.findUnique.mockResolvedValue(null);

    await expect(service.createCodeResetPassword('johndoe@gmail.com')).rejects.toThrow(NotFoundException);
  });

  it('should throw NotFoundException when veryfying code reset password a non-existing user', async () => {
    prismaMock.users.findUnique.mockResolvedValue(null);

    await expect(service.verifyResetCode(
      'johndoe@gmail.com',
      123456,
    )).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException when veryfying code reset password with invalid code', async () => {
    prismaMock.users.findUnique.mockResolvedValue({
      first_name: 'John',
    });
    redisServiceMock.verifyResetCode.mockResolvedValue(false);

    await expect(service.verifyResetCode(
      'johndoe@gmail.com',
      123456,
    )).rejects.toThrow(BadRequestException);
  });

  it('should throw NotFoundException when reseting password a non-existing user', async () => {
    prismaMock.users.findUnique.mockResolvedValue(null);

    await expect(service.resetPassword(
      'johndoe@gmail.com',
      'NewPassword123@',
    )).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException when reseting password with invalid code', async () => {
    prismaMock.users.findUnique.mockResolvedValue({
      first_name: 'John',
    });
    redisServiceMock.isResetCodeVerified.mockResolvedValue(false);

    await expect(service.resetPassword(
      'johndoe@gmail.com',
      'NewPassword123@',
    )).rejects.toThrow(BadRequestException);
  });
});
