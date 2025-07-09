import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailsService {
  constructor(private mailerService: MailerService) {}

  async sendUserResetPassword(username: string, email: string, code: number) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Recuperación de cuenta',
      template: './reset-password',
      context: {
        username,
        email,
        code,
      },
    });
  }
}
