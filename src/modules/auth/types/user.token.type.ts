/**
 * Tipo que representa la estructura de una token JWT de sesion.
 *
 * @type
 */
export type UserSession = {
  /** El nombre de usuario de la cuenta. */
  username: string;

  /** El correo electronico de la cuenta. */
  email: string;
};
