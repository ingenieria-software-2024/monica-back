import { Injectable, Logger } from '@nestjs/common';
import { IMailService } from './mail.interface';
import * as Sendgrid from '@sendgrid/mail';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService implements IMailService {
  readonly #logger = new Logger(MailService.name);

  readonly #client: Sendgrid.MailService;

  readonly #otpTemplateId: string;
  readonly #senderAddress: string;

  constructor(private readonly config: ConfigService) {
    this.#client = Sendgrid;

    this.#client.setApiKey(this.config.get<string>('SENDGRID_APIKEY'));

    this.#otpTemplateId = this.config.get<string>('SENDGRID_TEMPLATE_OTP');
    this.#senderAddress = this.config.get<string>('SENDGRID_FROM');
  }

  async sendRecoveryCode(email: string, code: string): Promise<void> {
    try {
      // Configurar el mensaje.
      await this.#client.send({
        from: this.#senderAddress,
        to: email,
        templateId: this.#otpTemplateId,
        dynamicTemplateData: {
          user: email,
          otp_code: code,
        },
      });
    } catch (e) {
      this.#logger.error(
        `Error al enviar el correo de recuperación a ${email}.`,
        e,
      );
    }
  }
}
