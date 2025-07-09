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
    await this.redis.setex(key, 600, code); // 600 segundos = 10 minutos

    console.log(`🔑 Generated reset code for ${email}: ${code}`);
    return code;
  }

  /**
   * Verificar código de reseteo
   */
  async verifyResetCode(email: string, code: string): Promise<boolean> {
    const key = `password_reset:${email}`;
    const storedCode = await this.redis.get(key);

    if (!storedCode) {
      console.log(`❌ No reset code found for ${email} or code expired`);
      return false;
    }

    const isValid = storedCode === code;
    console.log(`${isValid ? '✅' : '❌'} Code verification for ${email}: ${isValid}`);

    if (isValid) {
      // Marcar como verificado (válido por 30 minutos para resetear)
      const verifiedKey = `password_reset_verified:${email}`;
      await this.redis.setex(verifiedKey, 1800, 'verified'); // 30 minutos

      // Opcional: eliminar el código usado
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
    console.log(
      `${hasVerified ? '✅' : '❌'} Reset verification status for ${email}: ${hasVerified}`,
    );

    return hasVerified;
  }

  /**
   * Limpiar verificación después de resetear la contraseña
   */
  async clearResetVerification(email: string): Promise<void> {
    const verifiedKey = `password_reset_verified:${email}`;
    await this.redis.del(verifiedKey);
    console.log(`🧹 Cleared reset verification for ${email}`);
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
