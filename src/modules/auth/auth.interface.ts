export interface IAuthService {
  /**
   * Genera una nueva token de sesion para el login de un usuario de Monica.
   *
   * @param {string} username Nombre de usuario (o correo electronico) del usuario.
   * @param {string} password Contraseña del usuario.
   *
   * @returns {Promise<string>} JWT de sesion firmada.
   */
  authenticate(username: string, password: string): Promise<string>;

  /**
   * Valida la sesion de un usuario para determinar si sigue siendo valida.
   *
   * @param {string} authToken La token de autenticacion del usuario.
   *
   * @returns {Promise<boolean>} `true` si la sesion es valida, `false` en caso contrario.
   */
  validateSession(authToken: string): Promise<boolean>;

  /**
   * Inicia el proceso de recuperacion de contraseña para un usuario.
   *
   * @param {string} email Correo electronico del usuario.
   *
   * @returns {Promise<void>} Promesa que se resuelve cuando el proceso de recuperacion ha iniciado.
   */
  recoverPassword(email: string): Promise<void>;

  /**
   * Cambia la contraseña de un usuario.
   *
   * @param {string} email Correo electronico del usuario.
   * @param {string} code Codigo de recuperacion.
   * @param {string} newPassword Nueva contraseña.
   *
   * @returns {Promise<void>} Promesa que se resuelve cuando la contraseña ha sido cambiada.
   */
  changePassword(
    email: string,
    code: string,
    newPassword: string,
  ): Promise<void>;
}
