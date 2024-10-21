import { Prisma, User } from '@prisma/client';

export interface IUsersService {
  /**
   * Devuelve un listado con todos los usuarios
   *
   * @returns {Promise<Array<User>>} Un listado con todos los usuarios registrados.
   */
  getAllUsers(): Promise<Array<User>>;

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
}
