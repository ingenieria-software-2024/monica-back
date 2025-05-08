import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';
import * as Sendgrid from '@sendgrid/mail';

describe('MailService', () => {
  let mailService: MailService;

  const mockConfigService = {
    get: jest.fn(),
  };

  // Mock the SendGrid module
  jest.mock('@sendgrid/mail', () => ({
    setApiKey: jest.fn(),
    send: jest.fn(),
  }));

  beforeEach(async () => {
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

  it('should be defined', () => {
    expect(mailService).toBeDefined();
  });

  describe('sendRecoveryCode', () => {
    const email = 'test@example.com';
    const code = '123456';

    beforeEach(() => {
      mockConfigService.get.mockImplementation((key) => {
        switch (key) {
          case 'SENDGRID_APIKEY':
            return 'SG.exampleapikey';
          case 'SENDGRID_TEMPLATE_OTP':
            return 'your_template_id';
          case 'SENDGRID_FROM':
            return 'sender@example.com';
          default:
            throw new Error(`Unexpected config key: ${key}`);
        }
      });
    });

    it('should send recovery code successfully', async () => {
      // Mock SendGrid send to resolve successfully
      (Sendgrid.send as jest.Mock).mockResolvedValueOnce({});

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

    it('should log error if sending fails', async () => {
      // Mock SendGrid send to reject with an error
      const sendgridError = new Error('Sendgrid API error');
      (Sendgrid.send as jest.Mock).mockRejectedValueOnce(sendgridError);

      // Spy on Logger.error to verify it was called
      const loggerSpy = jest.spyOn(console, 'error').mockImplementation();

      await expect(mailService.sendRecoveryCode(email, code)).rejects.toThrow(
        sendgridError,
      );

      expect(loggerSpy).toHaveBeenCalledWith(
        'Error sending recovery code:',
        sendgridError,
      );

      loggerSpy.mockRestore();
    });
  });
});
