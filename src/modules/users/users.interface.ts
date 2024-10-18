import { User } from '@prisma/client';

export interface IUserService {
  /**
   * Crea un nuevo usuario
   * @param {string} username Nombre de usuario
   * @param {string} email Correo electrónico
   * @param {string} password Contraseña
   *
   * @returns {Promise<User>}
   */
  createUser(username: string, email: string, password: string): Promise<User>;

  /**
   * Devuelve un listado con todos los usuarios
   *
   * return {Promise<Array<Users>>}
   */
  getAllUsers(): Promise<Array<User>>;

  /**
   * devuelve un usuario por su id
   * @param {number} id
   *
   * @returns {Promise<Users>}
   */
  getUserById(id: number): Promise<User>;
}
