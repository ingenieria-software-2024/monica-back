import { Prisma, User } from '@prisma/client';

export interface IUsersService {
  /**
   * Devuelve un listado con todos los usuarios
   *
   * @returns {Promise<Array<User>>}
   */
  getAllUsers(): Promise<Array<User>>;

  /**
   * Devuelve un usuario por su id
   *
   * @param {number} id
   *
   * @returns {Promise<Users>}
   */
  getUserById(id: number): Promise<User>;

  /**
   * Crea un nuevo usuario
   * @param {string} username Nombre de usuario
   * @param {string} email Correo electrónico
   * @param {string} password Contraseña
   *
   * @returns {Promise<User>}
   */
  createUser(data: Prisma.UserCreateInput): Promise<User>;
}
