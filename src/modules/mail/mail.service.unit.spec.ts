// src/modules/mail/mail.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';
import * as Sendgrid from '@sendgrid/mail';

describe('MailService', () => {
  let mailService: MailService;

  const mockConfigService = {
    get: jest.fn(),
  };

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

    it('should send recovery code successfully', async () => {
      mockConfigService.get.mockImplementation((key) => {
        switch (key) {
          case 'SENDGRID_APIKEY':
            return 'your_sendgrid_api_key';
          case 'SENDGRID_TEMPLATE_OTP':
            return 'your_template_id';
          case 'SENDGRID_FROM':
            return 'sender@example.com';
          default:
            throw new Error(`Unexpected config key: ${key}`);
        }
      });

      const mockSend = jest.fn();
      (Sendgrid as any).setApiKey = jest.fn();
      (Sendgrid as any).send = mockSend;

      await mailService.sendRecoveryCode(email, code);

      expect(mockConfigService.get).toBeCalledWith('SENDGRID_APIKEY');
      expect((Sendgrid as any).setApiKey).toBeCalledWith(
        'your_sendgrid_api_key',
      );
      expect(mockConfigService.get).toBeCalledWith('SENDGRID_TEMPLATE_OTP');
      expect(mockConfigService.get).toBeCalledWith('SENDGRID_FROM');
      expect(mockSend).toHaveBeenCalledWith({
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
      mockConfigService.get.mockImplementation((key) => {
        switch (key) {
          case 'SENDGRID_APIKEY':
            return 'your_sendgrid_api_key';
          case 'SENDGRID_TEMPLATE_OTP':
            return 'your_template_id';
          case 'SENDGRID_FROM':
            return 'sender@example.com';
          default:
            throw new Error(`Unexpected config key: ${key}`);
        }
      });

      const mockSend = jest
        .fn()
        .mockRejectedValue(new Error('Sendgrid API error'));
      (Sendgrid as any).setApiKey = jest.fn();
      (Sendgrid as any).send = mockSend;

      await mailService.sendRecoveryCode(email, code);

      expect(mockSend).toThrow(Error);
    });
  });
});
