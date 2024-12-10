import { UsersService } from './users.service';
import { Test } from '@nestjs/testing';
import { CreateUserDto } from './dto/create-user.dto';
import { isEmail, isStrongPassword } from 'class-validator';
import { PrismaService } from '../../providers/prisma.service';

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

  describe('Validación de contraseña de usuario', () => {
    it('La contraseña es demasiado corta', async () => {
      const dto: CreateUserDto = {
        username: undefined,
        email: undefined,
        password: '12345',
      };

      expect(isStrongPassword(dto.password, { minLength: 8 })).toBe(false);
    });

    it('La contraseña no contiene números', async () => {
      const dto: CreateUserDto = {
        username: undefined,
        email: undefined,
        password: 'contraseña',
      };
      expect(isStrongPassword(dto.password, { minNumbers: 1 })).toBe(false);
    });

    it('La contraseña no contiene letras mayúsculas', async () => {
      const dto: CreateUserDto = {
        username: undefined,
        email: undefined,
        password: 'contraseña123',
      };
      expect(isStrongPassword(dto.password, { minUppercase: 1 })).toBe(false);
    });

    it('La contraseña no contiene letras minúsculas', async () => {
      const dto: CreateUserDto = {
        username: undefined,
        email: undefined,
        password: 'CONTRASEÑA123',
      };
      expect(isStrongPassword(dto.password, { minLowercase: 1 })).toBe(false);
    });

    it('La contraseña no contiene caracteres especiales', async () => {
      const dto: CreateUserDto = {
        username: undefined,
        email: undefined,
        password: 'Contraseña123',
      };
      expect(isStrongPassword(dto.password, { minSymbols: 1 })).toBe(false);
    });

    it('La contraseña cumple con los requisitos mínimos de seguridad', async () => {
      const dto: CreateUserDto = {
        username: undefined,
        email: undefined,
        password: 'Contraseña123!',
      };
      //Verifica que la contraseña cumple con los requisitos mínimos de seguridad definidos por "IsStrongPassword"
      expect(isStrongPassword(dto.password)).toBe(true);
    });
  });
});
