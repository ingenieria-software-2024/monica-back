import { AuditUserLogin, User } from '@prisma/client';

export interface IAuditUserService {
  /**
   * Registra el inicio de sesion de un usuario en el auditing log.
   *
   * @param {User} user El usuario que ha iniciado sesion.
   * @param {string} ipAddress La dirección IP desde la que se ha iniciado sesion.
   * @param {string} userAgent El agente de usuario del navegador que ha iniciado sesion.
   * @param {string} [os] Opcional. El sistema operativo del dispositivo que ha iniciado sesion.
   *
   * @returns {Promise<AuditUserLogin>} La entrada de auditoria creada.
   */
  logUserLogin(
    user: User,
    ipAddress: string,
    userAgent: string,
    os?: string,
  ): Promise<AuditUserLogin>;
}
