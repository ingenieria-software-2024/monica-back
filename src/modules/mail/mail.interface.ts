export interface IMailService {
  /**
   * Envía un correo con un código de uso único para la recuperación de contraseña.
   *
   * @param {string} email Correo electronico del usuario.
   * @param {string} code Código de uso único.
   *
   * @returns {Promise<void>} Promesa que se resuelve cuando el correo ha sido enviado.
   */
  sendRecoveryCode(email: string, code: string): Promise<void>;
}
