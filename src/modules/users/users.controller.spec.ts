import { Test, TestingModule } from '@nestjs/testing';
import { UsersServices } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/prisma.service';
import { MailsService } from '../mails/mails.service';
import { RedisService } from 'src/common/redis/redis.service';
import { UserBaseDto } from './dto/user-base.dto';

const dto: CreateUserDto = {
  first_name: 'John',
  last_name: 'Doe',
  email: 'jonhdoe@gmail.com',
  password: 'Password123@',
};

const response: UserBaseDto = {
  id: 1,
  first_name: 'John',
  last_name: 'Doe',
  email: 'jonhdoe@gmail.com',
};

describe('UsersController', () => {
  let controller: UsersController;
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
      controllers: [UsersController],
      providers: [
        UsersServices,
        { provide: PrismaService, useValue: prismaMock },
        { provide: MailsService, useValue: mailsServiceMock },
        { provide: RedisService, useValue: redisServiceMock },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersServices>(UsersServices);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call UsersService.createUser', async () => {
    jest.spyOn(service, 'createUser').mockResolvedValue(response);

    const result = await controller.createUser(dto);

    expect(service.createUser).toHaveBeenCalledWith(dto);
    expect(result).toEqual(response);
  });

  it('should call UsersService.getUsers', async () => {
    jest.spyOn(service, 'getUsers').mockResolvedValue([response]);

    const result = await controller.getAllUsers();

    expect(service.getUsers).toHaveBeenCalled();
    expect(result).toEqual([response]);
  });

  it('should call UsersService.getUserById', async () => {
    jest.spyOn(service, 'getUserById').mockResolvedValue(response);

    const result = await controller.getUserById(1);

    expect(service.getUserById).toHaveBeenCalledWith(1);
    expect(result).toEqual(response);
  });

  it('should call UsersService.updateUser', async () => {
    jest.spyOn(service, 'updateUser').mockResolvedValue(response);

    const result = await controller.updateUser(1, dto);

    expect(service.updateUser).toHaveBeenCalledWith(1, dto);
    expect(result).toEqual(response);
  });

  it('should call UsersService.deleteUser', async () => {
    jest.spyOn(service, 'deleteUser').mockResolvedValue(response);

    const result = await controller.deleteUser(1);

    expect(service.deleteUser).toHaveBeenCalledWith(1);
    expect(result).toEqual(response);
  });

  it('should call UsersService.login', async () => {
    const data = {
      email: 'johndoe@gmail.com',
      password: 'Password123@',
    };

    jest.spyOn(service, 'login').mockResolvedValue(response);

    const result = await controller.login(data);

    expect(service.login).toHaveBeenCalledWith(data.email, data.password);
    expect(result).toEqual(response);
  });

  it('should call UsersService.createCodeResetPassword', async () => {
    const response = {
      message: 'Reset code sent to email',
      email: 'johndoe@gmail.com',
      expiresIn: '10 minutes',
    }

    jest.spyOn(service, 'createCodeResetPassword').mockResolvedValue(response);

    const result = await controller.createCodeResetPassword({ email: 'johndoe@gmail.com' });

    expect(service.createCodeResetPassword).toHaveBeenCalledWith('johndoe@gmail.com');
    expect(result).toEqual(response);
  });

  it('should call UsersService.verifyResetCode', async () => {
    const response = {
      message: 'Reset code verified successfully',
      validFor: '30 minutes',
      email: 'johndoe@gmail.com',
      verified: true,
    };

    jest.spyOn(service, 'verifyResetCode').mockResolvedValue(response);

    const result = await controller.verifyResetCode({ email: 'johndoe@gmail.com', code: 123456 });

    expect(service.verifyResetCode).toHaveBeenCalledWith('johndoe@gmail.com', 123456);
    expect(result).toEqual(response);
  });

  it('should call UsersService.resetPassword', async () => {
    const responseData = {
      message: 'Password reset successfully',
      email: 'johndoe@gmail.com',
      user: response,
    };

    jest.spyOn(service, 'resetPassword').mockResolvedValue(responseData);

    const result = await controller.resetPassword({ email: 'johndoe@gmail.com', newPassword: 'NewPassword123@' });

    expect(service.resetPassword).toHaveBeenCalledWith('johndoe@gmail.com', 'NewPassword123@');
    expect(result).toEqual(responseData);
  });
});
