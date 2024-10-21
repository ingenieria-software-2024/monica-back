import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/providers/prisma.service';
import { Prisma, User } from '@prisma/client';
import { IUsersService } from './users.interface';
import { genSalt, hash } from 'bcrypt';

@Injectable()
export class UsersService implements IUsersService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async getUserById(id: number): Promise<User> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    // Generar una salt para el hashing.
    const salt = await genSalt();

    // Hashear contraseña del usuario.
    const password = await hash(data.password, salt);

    // Crear el nuevo usuario con la constraseña hasheada.
    return this.prisma.user.create({ data: { ...data, password } });
  }
}
