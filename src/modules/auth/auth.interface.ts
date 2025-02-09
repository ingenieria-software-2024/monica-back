import { Request } from 'express';

export interface IAuthService {
  /**
   * Genera una nueva token de sesion para el login de un usuario de Monica.
   *
   * @param {string} username Nombre de usuario (o correo electronico) del usuario.
   * @param {string} password Contraseña del usuario.
   * @param {Request} [req] Opcional. Objeto de solicitud HTTP original.
   *
   * @returns {Promise<string>} JWT de sesion firmada.
   */
  authenticate(
    username: string,
    password: string,
    req?: Request,
  ): Promise<string>;

  /**
   * Valida la sesion de un usuario para determinar si sigue siendo valida.
   *
   * @param {string} authToken La token de autenticacion del usuario.
   *
   * @returns {Promise<boolean>} `true` si la sesion es valida, `false` en caso contrario.
   */
  validateSession(authToken: string): Promise<boolean>;
}
