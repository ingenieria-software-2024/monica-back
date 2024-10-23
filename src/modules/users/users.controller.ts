import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { User } from '@prisma/client';

@Controller('/users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  /**
   * @returns {Promise<Array<User>>} todos los usuarios
   */
  @Get()
  async getAllUsers(): Promise<Array<User>> {
    return this.service.getAllUsers();
  }

  /**
   * @param id
   *
   * @returns {Promise<User>} un usuario según la id proporcionada
   */
  @Get('/:id')
  async getUserById(@Param('id') id: string): Promise<User> {
    const user = await this.service.getUserById(parseInt(id));
    if (!user) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    return user;
  }

  /**
   * registra un nuevo usuario
   *
   * @param id
   * @param createUserDto
   *
   * @returns {Promise<User>} el usuario creado
   */
  @Post('/register')
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.service.createUser(createUserDto);
  }
}
