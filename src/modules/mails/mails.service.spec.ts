import { Test, TestingModule } from '@nestjs/testing';
import { MailsService } from './mails.service';
import { MailerService } from '@nestjs-modules/mailer';

describe('MailsService', () => {
  let service: MailsService;

  const mailerMock = {
    sendMail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailsService,
        { provide: MailerService, useValue: mailerMock },
      ],
    }).compile();

    service = module.get<MailsService>(MailsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call mailerService.sendMail with correct params', async () => {
    const username = 'John';
    const email = 'john@example.com';
    const code = 123456;

    mailerMock.sendMail.mockResolvedValue(undefined);

    await service.sendUserResetPassword(username, email, code);

    expect(mailerMock.sendMail).toHaveBeenCalledTimes(1);
    const callArg = mailerMock.sendMail.mock.calls[0][0];
    expect(callArg).toMatchObject({
      to: email,
      subject: 'Recuperación de cuenta',
      template: './reset-password',
      context: { username, email, code },
    });
  });

  it('should propagate error if mailerService.sendMail rejects', async () => {
    const username = 'John';
    const email = 'john@example.com';
    const code = 123456;

    mailerMock.sendMail.mockRejectedValue(new Error('SMTP error'));

    await expect(service.sendUserResetPassword(username, email, code)).rejects.toThrow('SMTP error');
  });
});
