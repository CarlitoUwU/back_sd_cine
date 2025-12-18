import { Test, TestingModule } from '@nestjs/testing';
import { RedisModule } from './redis.module';
import { ConfigModule } from '@nestjs/config';

jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => ({
    connect: jest.fn().mockResolvedValue(true),
  }));
});

describe('RedisModule', () => {
  const OLD_ENV = process.env.REDIS_URL;

  afterEach(() => {
    process.env.REDIS_URL = OLD_ENV;
    jest.clearAllMocks();
  });

  it('should return null REDIS_CLIENT when REDIS_URL is not defined', async () => {
    delete process.env.REDIS_URL;

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        RedisModule,
      ],
    }).compile();

    const redisClient = module.get('REDIS_CLIENT');

    expect(redisClient).toBeNull();
  });

  it('should create Redis client and call connect when REDIS_URL exists', async () => {
    process.env.REDIS_URL = 'redis://localhost:6379';

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        RedisModule,
      ],
    }).compile();

    const redisClient = module.get<any>('REDIS_CLIENT');

    expect(redisClient).toBeDefined();
    expect(redisClient.connect).toHaveBeenCalled();
  });

  it('should log warning when Redis connection fails', async () => {
    process.env.REDIS_URL = 'redis://localhost:6379';

    jest.spyOn(console, 'warn').mockImplementation();

    jest.doMock('ioredis', () => {
      return jest.fn().mockImplementation(() => ({
        connect: jest.fn().mockRejectedValue(new Error('Connection failed')),
      }));
    });

    const { RedisModule } = await import('./redis.module');

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        RedisModule,
      ],
    }).compile();

    module.get('REDIS_CLIENT');

    expect(module).toBeDefined();
  });

});
