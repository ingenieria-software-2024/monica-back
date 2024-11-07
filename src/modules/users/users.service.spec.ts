import { PrismaService } from '../../providers/prisma.service';
import { UsersService } from './users.service';
import { Test } from '@nestjs/testing';
import { CreateUserDto } from './dto/create-user.dto';
import { isEmail } from 'class-validator';

describe('Test Unitarios de UsersModule', () => {
  beforeAll(async () => {
    await Test.createTestingModule({
      providers: [UsersService, PrismaService],
    }).compile();
  });

  describe('Validación de Email de Usuario', () => {
    it('Debe tener formato de email válido según el estándar rfc 5322', async () => {
      const dto: CreateUserDto = {
        username: undefined,
        email: 'guidoserniotti.com',
        password: undefined,
      };

      //Verificar que el correo respete el formato de email válido según el estándar rfc 5322
      expect(isEmail(dto.email)).toBe(false);
    });

    it('Debe tener formato de email válido según el estándar rfc 5322', async () => {
      const dto: CreateUserDto = {
        username: undefined,
        email: 'guidoserniotti@gmail.com',
        password: undefined,
      };

      expect(isEmail(dto.email)).toBe(true);
    });
  });
});
