import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../providers/prisma.service';
import { Prisma, User } from '@prisma/client';
import { IUsersService } from './users.interface';
import { genSalt, hash, compare } from 'bcrypt';

@Injectable()
export class UsersService implements IUsersService {
  /** Accesor CRUD para la entidad de usuarios. */
  readonly #users: Prisma.UserDelegate;

  constructor(private prisma: PrismaService) {
    this.#users = prisma.user;
  }

  async verifyPassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    // Comparar las contraseñas.
    return await compare(password, hashedPassword);
  }

  async getAllUsers(): Promise<User[]> {
    return this.#users.findMany();
  }

  async getUserByUsernameOrEmail(identificator: string): Promise<User> {
    const byUsername = await this.#users.findUnique({
      where: {
        username: identificator,
      },
    });

    if (!byUsername) {
      const byEmail = await this.#users.findUnique({
        where: {
          email: identificator,
        },
      });

      if (!byEmail)
        throw new NotFoundException(`Usuario ${identificator} no encontrado.`);

      return byEmail;
    }

    return byUsername;
  }

  async getUserById(id: number): Promise<User> {
    const user = this.#users.findUnique({ where: { id } });

    if (!user)
      throw new NotFoundException(`Usuario con ID ${id} no encontrado.`);

    return user;
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    // Generar una salt para el hashing.
    const salt = await genSalt();

    // Hashear contraseña del usuario.
    const password = await hash(data.password, salt);

    // Verificar que el email sea único
    const existingUser = await this.#users.findFirst({
      where: {
        OR: [{ email: data.email }, { username: data.username }],
      },
    });

    if (existingUser)
      // Si el email ya existe, lanzar una excepción ConflictException.
      throw new ConflictException(
        'El email o nombre de usuario ya estan registrados.',
      );

    return this.#users.create({ data: { ...data, password } });
  }

  async updateUser(id: number, data: Prisma.UserUpdateInput): Promise<User> {
    // Verificar si el usuario existe.
    const user = await this.#users.findUnique({ where: { id } });

    if (!user)
      // Si el usuario no existe, lanzar una excepción NotFoundException.
      throw new NotFoundException(`Usuario con ID ${id} no encontrado.`);

    // Actualizar el usuario.
    return this.#users.update({ where: { id }, data });
  }

  async startPasswordRecovery(email: string, code: string): Promise<void> {
    // Verificar si el usuario existe.
    const user = await this.#users.findUnique({ where: { email } });

    if (!user)
      // Si el usuario no existe, lanzar una excepción NotFoundException.
      throw new NotFoundException(`Usuario con correo ${email} no encontrado.`);

    // Si se ha generado un código de recuperación, lanzar una excepción.
    if (user?.recoveryCode !== null && user?.recoveryCodeGenerated)
      throw new ConflictException(
        'Ya se ha generado un código de recuperación',
      );

    // Rellena el código generado en el usuario.
    await this.#users.update({
      where: { email },
      data:
        code === null
          ? {
              recoveryCode: null,
              recoveryCodeGenerated: null,
            }
          : {
              recoveryCode: code,
              recoveryCodeGenerated: new Date(),
            },
    });
  }
}
