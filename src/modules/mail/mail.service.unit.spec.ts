import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';
import * as Sendgrid from '@sendgrid/mail';
import { Logger } from '@nestjs/common';

// Se mockea el módulo @sendgrid/mail para aislar el servicio en las pruebas.
jest.mock('@sendgrid/mail', () => ({
  setApiKey: jest.fn(),
  send: jest.fn(),
}));

describe('MailService', () => {
  let mailService: MailService;
  let mockConfigService: { get: jest.Mock };

  beforeEach(async () => {
    mockConfigService = {
      get: jest.fn(),
    };

    mockConfigService.get.mockImplementation((key: string) => {
      switch (key) {
        case 'SENDGRID_APIKEY':
          return 'SG.exampleapikey';
        case 'SENDGRID_TEMPLATE_OTP':
          return 'your_template_id';
        case 'SENDGRID_FROM':
          return 'sender@example.com';
        default:
          return null;
      }
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    mailService = module.get<MailService>(MailService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería estar definido', () => {
    expect(mailService).toBeDefined();
  });

  describe('sendRecoveryCode', () => {
    const email = 'test@example.com';
    const code = '123456';

    it('debería enviar el código de recuperación exitosamente', async () => {
      (Sendgrid.send as jest.Mock).mockResolvedValueOnce([{}]);

      await mailService.sendRecoveryCode(email, code);

      expect(Sendgrid.send).toHaveBeenCalledWith({
        from: 'sender@example.com',
        to: email,
        templateId: 'your_template_id',
        dynamicTemplateData: {
          user: email,
          otp_code: code,
        },
      });
    });

    it('debería registrar un error si el envío falla', async () => {
      const sendgridError = new Error('Sendgrid API error');
      (Sendgrid.send as jest.Mock).mockRejectedValueOnce(sendgridError);

      const loggerSpy = jest
        .spyOn(Logger.prototype, 'error')
        .mockImplementation();

      await mailService.sendRecoveryCode(email, code);

      expect(loggerSpy).toHaveBeenCalledWith(
        `Error al enviar el correo de recuperación a ${email}.`,
        sendgridError,
      );

      loggerSpy.mockRestore();
    });
  });
});
