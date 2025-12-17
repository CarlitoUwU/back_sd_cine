import { Injectable, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  /**
   * Generar y guardar código de reseteo de contraseña
   */
  async generateResetCode(email: string): Promise<string> {
    // Generar código de 6 dígitos
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Guardar en Redis con expiración de 10 minutos
    const key = `password_reset:${email}`;
    await this.redis.setex(key, 60 * 10, code);

    return code;
  }

  /**
   * Verificar código de reseteo
   */
  async verifyResetCode(email: string, code: string): Promise<boolean> {
    const key = `password_reset:${email}`;
    const storedCode = await this.redis.get(key);

    if (!storedCode) {
      return false;
    }

    const isValid = storedCode === code;

    if (isValid) {
      // Marcar como verificado (válido por 30 minutos para resetear)
      const verifiedKey = `password_reset_verified:${email}`;
      await this.redis.setex(verifiedKey, 60 * 30, 'verified');

      await this.redis.del(key);
    }

    return isValid;
  }

  /**
   * Verificar si el usuario ha verificado su código recientemente
   */
  async isResetCodeVerified(email: string): Promise<boolean> {
    const verifiedKey = `password_reset_verified:${email}`;
    const isVerified = await this.redis.get(verifiedKey);

    const hasVerified = !!isVerified;

    return hasVerified;
  }

  /**
   * Limpiar verificación después de resetear la contraseña
   */
  async clearResetVerification(email: string): Promise<void> {
    const verifiedKey = `password_reset_verified:${email}`;
    await this.redis.del(verifiedKey);
  }

  /**
   * Métodos generales de Redis para otros usos
   */
  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.redis.setex(key, ttl, value);
    } else {
      await this.redis.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    return await this.redis.get(key);
  }

  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.redis.exists(key);
    return result === 1;
  }
}
