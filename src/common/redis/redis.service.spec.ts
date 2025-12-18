import { Test, TestingModule } from '@nestjs/testing';
import { RedisService } from './redis.service';

describe('RedisService', () => {
  let service: RedisService;

  const redisMock = {
    setex: jest.fn(),
    get: jest.fn(),
    del: jest.fn(),
    set: jest.fn(),
    exists: jest.fn(),
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: 'REDIS_CLIENT', useValue: redisMock }, RedisService],
    }).compile();

    service = module.get<RedisService>(RedisService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('generateResetCode should setex and return a 6-digit string', async () => {
    redisMock.setex.mockResolvedValue('OK');

    const code = await service.generateResetCode('test@example.com');

    expect(redisMock.setex).toHaveBeenCalled();
    expect(typeof code).toBe('string');
    expect(code).toHaveLength(6);
  });

  it('verifyResetCode should return false if no stored code', async () => {
    redisMock.get.mockResolvedValue(null);

    const res = await service.verifyResetCode('a@b.com', '123456');

    expect(redisMock.get).toHaveBeenCalled();
    expect(res).toBe(false);
  });

  it('verifyResetCode should return true and set verified key and delete code when valid', async () => {
    redisMock.get.mockResolvedValue('123456');
    redisMock.setex.mockResolvedValue('OK');
    redisMock.del.mockResolvedValue(1);

    const res = await service.verifyResetCode('a@b.com', '123456');

    expect(res).toBe(true);
    expect(redisMock.setex).toHaveBeenCalledWith('password_reset_verified:a@b.com', 1800, 'verified');
    expect(redisMock.del).toHaveBeenCalledWith('password_reset:a@b.com');
  });

  it('isResetCodeVerified should return boolean based on redis.get', async () => {
    redisMock.get.mockResolvedValue('verified');
    const yes = await service.isResetCodeVerified('a@b.com');
    expect(yes).toBe(true);

    redisMock.get.mockResolvedValue(null);
    const no = await service.isResetCodeVerified('a@b.com');
    expect(no).toBe(false);
  });

  it('clearResetVerification should call del', async () => {
    redisMock.del.mockResolvedValue(1);
    await service.clearResetVerification('a@b.com');
    expect(redisMock.del).toHaveBeenCalledWith('password_reset_verified:a@b.com');
  });

  it('set should call setex when ttl provided, otherwise set', async () => {
    redisMock.setex.mockResolvedValue('OK');
    redisMock.set.mockResolvedValue('OK');

    await service.set('k', 'v', 10);
    expect(redisMock.setex).toHaveBeenCalledWith('k', 10, 'v');

    await service.set('k2', 'v2');
    expect(redisMock.set).toHaveBeenCalledWith('k2', 'v2');
  });

  it('get should return value from redis.get', async () => {
    redisMock.get.mockResolvedValue('value');
    const v = await service.get('k');
    expect(v).toBe('value');
  });

  it('del should call redis.del', async () => {
    redisMock.del.mockResolvedValue(1);
    await service.del('k');
    expect(redisMock.del).toHaveBeenCalledWith('k');
  });

  it('exists should return true when redis.exists returns 1', async () => {
    redisMock.exists.mockResolvedValue(1);
    const e = await service.exists('k');
    expect(e).toBe(true);

    redisMock.exists.mockResolvedValue(0);
    const e2 = await service.exists('k');
    expect(e2).toBe(false);
  });
});
