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

@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * @returns todos los usuarios
   */
  @Get()
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }

  /**
   * @param id
   * @returns un usuario según la id proporcionada
   */
  @Get('/:id')
  async getUserById(@Param('id') id: string) {
    const user = await this.usersService.getUserById(parseInt(id));
    if (!user) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    return user;
  }

  /**
   * @param id
   * @param createUserDto
   * @returns registra un nuevo usuario
   */
  @Post('/register')
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }
}
