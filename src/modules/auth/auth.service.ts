import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { IAuthService } from './auth.interface';
import { User } from '@prisma/client';
import { UserSession } from './types/user.token.type';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { IUsersService } from '../users/users.interface';
import { AuditUserService } from '../audit/audit.users.service';
import { IAuditUserService } from '../audit/audit.users.interface';
import { Request } from 'express';

@Injectable()
export class AuthService implements IAuthService {
  readonly #logger = new Logger(AuthService.name);

  constructor(
    private readonly jwt: JwtService,
    @Inject(UsersService) private readonly users: IUsersService,
    @Inject(AuditUserService) private readonly audit: IAuditUserService,
  ) {}

  public static validateTokenStatic(token: string): boolean {
    try {
      const payload = token?.split('.')?.[1];

      // Decodificar el payload.
      const decodedPayload = Buffer.from(payload, 'base64').toString('utf-8');

      // Convertir a objeto.
      const parsedPayload: UserSession = JSON.parse(decodedPayload);

      // Verificar que el payload sea valido.
      if (!parsedPayload) return false;

      return true;
    } catch (error) {
      console.error(`Error al validar la sesion: ${error}`);
      return false;
    }
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
    const { username, email } = user;

    // Generar la estructura de la token.
    const payload: UserSession = {
      username,
      email,
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
    await this.audit.logUserLogin(user, req.ip, req.headers['user-agent']);

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
}
