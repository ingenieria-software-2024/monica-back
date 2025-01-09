import { Prisma, User } from '@prisma/client';

export interface IUsersService {
  /**
   * Utiliza una contraseña en texto plano y la compara con una contraseña hasheada.
   *
   * @param {string} password Contraseña en texto plano.
   * @param {string} hashedPassword Contraseña hasheada.
   *
   * @returns {boolean} `true` si la contraseña es correcta, `false` en caso contrario.
   */
  verifyPassword(password: string, hashedPassword: string): Promise<boolean>;

  /**
   * Devuelve un listado con todos los usuarios
   *
   * @returns {Promise<Array<User>>} Un listado con todos los usuarios registrados.
   */
  getAllUsers(): Promise<Array<User>>;

  /**
   * Busca a un usuario en base a su correo electronico o nombre de usuario.
   *
   * @param {string} identificator Correo electronico o nombre de usuario del usuario a buscar.
   *
   * @returns {Promise<User>} El usuario encontrado.
   */
  getUserByUsernameOrEmail(identificator: string): Promise<User>;

  /**
   * Devuelve un usuario por su id
   *
   * @param {number} id ID del usuario a buscar.
   *
   * @returns {Promise<User>} El usuario encontrado.
   */
  getUserById(id: number): Promise<User>;

  /**
   * Crea un nuevo usuario
   *
   * @param {Prisma.UserCreateInput} data Datos del usuario a crear.
   *
   * @returns {Promise<User>} El nuevo usuario creado.
   */
  createUser(data: Prisma.UserCreateInput): Promise<User>;

  /**
   * Modifica a un usuario existente.
   *
   * @param {number} id ID del usuario a modificar.
   * @param {Prisma.UserUpdateInput} data Datos del usuario a modificar.
   *
   * @returns {Promise<User>} El usuario modificado.
   */
  updateUser(id: number, data: Prisma.UserUpdateInput): Promise<User>;

  /**
   * Inicia un flujo de recuperación de contraseña para un usuario.
   *
   * @param {string} email Correo electronico del usuario.
   * @param {string} code Código de recuperación. Un valor de `null` anula el proceso de recuperación.
   *
   * @returns {Promise<void>} Promesa que se resuelve cuando el proceso de recuperación ha iniciado o se ha cancelado.
   */
  startPasswordRecovery(email: string, code: string): Promise<void>;
}
