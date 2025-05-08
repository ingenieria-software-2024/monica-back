import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { User } from '@prisma/client';
import { IUsersService } from './users.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request as RequestType } from 'express';
import { AuthGuard } from 'src/pipes/auth/auth.guard';

@Controller('/users')
export class UsersController {
  constructor(@Inject(UsersService) private readonly service: IUsersService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getAllUsers(): Promise<Array<User>> {
    return this.service.getAllUsers();
  }

  @Get('/:id')
  @UseGuards(AuthGuard)
  async getUserById(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return await this.service.getUserById(id);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard)
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
    @Request() req: RequestType,
  ): Promise<User> {
    // TODO: Migrate this off of the controller.
    if (updateUserDto?.role) {
      // Check the user roles if a role change was specified.
      const authorization = req.headers?.['authorization'];

      const token = authorization?.split(' ')?.[1];

      if (token) {
        const user = await this.service.getUserById(id);

        if (user.role !== updateUserDto.role)
          throw new UnauthorizedException(
            'No tienes permisos para cambiar el rol del usuario.',
          );
      }
    }

    return this.service.updateUser(id, updateUserDto);
  }

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
