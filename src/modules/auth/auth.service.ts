import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { IAuthService } from './auth.interface';
import { User } from '@prisma/client';
import { UserSession } from './types/user.token.type';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { IUsersService } from '../users/users.interface';
import { MailService } from '../mail/mail.service';
import { IMailService } from '../mail/mail.interface';
import { genSalt, hash } from 'bcrypt';
import { AuditUserService } from '../audit/audit.users.service';
import { IAuditUserService } from '../audit/audit.users.interface';
import type { Request } from 'express';

@Injectable()
export class AuthService implements IAuthService {
  readonly #logger = new Logger(AuthService.name);

  constructor(
    private readonly jwt: JwtService,
    @Inject(UsersService) private readonly users: IUsersService,
    @Inject(MailService) private readonly mail: IMailService,
    @Inject(AuditUserService) private readonly audit: IAuditUserService,
  ) {}

  public static validateTokenStatic(token: string): boolean {
    try {
      // Obtain the payload from the token.
      const payload = token?.split('.')?.[1];

      if (!payload) return false;

      // Decode the payload.
      const decoded = Buffer.from(payload, 'base64').toString('utf-8');

      // Parse the JSON payload.
      const json: UserSession = JSON.parse(decoded);

      if (!json) return false;

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  /**
   * Genera un código de un solo uso de 4 dígitos para la recuperación de contraseñas.
   *
   * @returns {string} Código de recuperación.
   */
  private generateOTPCode(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    let otp = '';
    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      otp += characters[randomIndex];
    }

    return otp;
  }

  /**
   * Genera una nueva JWT firmada con la sesion de un usuario.
   *
   * @param {User} user Usuario para el cual se generara la sesion.
   *
   * @returns {string} JWT firmada.
   */
  private generateAndSignSession(user: User): string {
    // Desestructurar lo necesario del usuario.
    const { username, email, role } = user;

    // Generar la estructura de la token.
    const payload: UserSession = {
      username,
      email,
      role,
    };

    // Crear la token JWT.
    const token = this.jwt.sign(payload);

    return token;
  }

  async authenticate(
    username: string,
    password: string,
    req?: Request,
  ): Promise<string> {
    // Buscar al usuario.
    const user = await this.users.getUserByUsernameOrEmail(username);

    if (!user)
      throw new UnauthorizedException(
        `El usuario o correo provisto no existe.`,
      );

    // Verificar la contraseña.
    const isPasswordValid = await this.users.verifyPassword(
      password,
      user.password,
    );

    if (!isPasswordValid)
      throw new UnauthorizedException(`La contraseña es incorrecta.`);

    // Generar la sesion.
    const authToken = this.generateAndSignSession(user);

    // Auditar la sesion.
    await this.audit.logUserLogin(
      user,
      req?.ip ?? '',
      req.headers['user-agent'],
    );

    return authToken;
  }

  async validateSession(authToken: string): Promise<boolean> {
    try {
      // Verificar la token.
      const payload = this.jwt.verify<UserSession>(authToken);

      // Buscar al usuario.
      const user = await this.users.getUserByUsernameOrEmail(payload.username);

      if (!user) return false;

      return true;
    } catch (error) {
      this.#logger.error(`Error al validar la sesion: ${error}`);
      return false;
    }
  }

  async recoverPassword(email: string): Promise<void> {
    try {
      // Buscar al usuario.
      const user = await this.users.getUserByUsernameOrEmail(email);

      if (!user)
        throw new NotFoundException(
          `Usuario con email ${email} no encontrado.`,
        );

      // Si ya se ha generado un código y aún no expiró, no generar uno nuevo.
      if (user?.recoveryCode) {
        // Verificar si el código ha expirado.
        const generatedAt = user?.recoveryCodeGenerated;

        if (!generatedAt || isNaN(generatedAt?.getTime())) return;

        const diff = new Date().getTime() - generatedAt.getTime();

        // Si aún no pasaron 5 minutos, no generar un nuevo código.
        if (diff < 300_000)
          throw new HttpException(
            'Ya se ha generado un código de recuperación.',
            HttpStatus.TOO_MANY_REQUESTS,
          );
      }

      // Generar un código de recuperación.
      const code = this.generateOTPCode();

      await this.users.startPasswordRecovery(email, code);

      // Envia un correo con el código de recuperación.
      await this.mail.sendRecoveryCode(email, code);

      this.#logger.warn(`${email} solicitó recuperación de cuenta.`);
    } catch (e) {
      this.#logger.error(`Error al recuperar la contraseña de ${email}: ${e}`);
      throw e;
    }
  }

  async changePassword(
    email: string,
    code: string,
    newPassword: string,
  ): Promise<void> {
    try {
      // Buscar al usuario.
      const user = await this.users.getUserByUsernameOrEmail(email);

      if (!user)
        throw new NotFoundException(
          `Usuario con email ${email} no encontrado.`,
        );

      // Verificar si el código es correcto.
      if (user?.recoveryCode !== code)
        throw new UnauthorizedException(
          'No tienes un código válido para cambiar la contraseña.',
        );

      // Verificar si el código ha expirado.
      const generatedAt = user?.recoveryCodeGenerated;

      if (!generatedAt || isNaN(generatedAt.getTime()))
        throw new InternalServerErrorException(
          'Algo salió mal cuando se generó tu código, por favor intenta de nuevo.',
        );

      const diff = new Date().getTime() - generatedAt.getTime();

      // Si han pasado más de 5 minutos, el código ha expirado.
      if (diff >= 300_000)
        throw new UnauthorizedException('El código ha expirado.');

      // Generar una salt para el hashing.
      const salt = await genSalt();

      // Hashear la nueva contraseña.
      const hashedPassword = await hash(newPassword, salt);

      // Actualizar la contraseña del usuario.
      await this.users.updateUser(user.id, { password: hashedPassword });

      // Anular el código de recuperación.
      await this.users.startPasswordRecovery(email, null);

      this.#logger.warn(`Se ha cambiado la contraseña de ${email}.`);
    } catch (e) {
      this.#logger.error(`Error al cambiar la contraseña de ${email}: ${e}`);
      throw e;
    }
  }
}
