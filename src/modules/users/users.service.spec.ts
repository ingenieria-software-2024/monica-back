import { UsersService } from './users.service';
import { Test } from '@nestjs/testing';
import { CreateUserDto } from './dto/create-user.dto';
import { isEmail, isStrongPassword } from 'class-validator';
import { PrismaService } from '../../providers/prisma.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { MailService } from '../mail/mail.service';

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

  describe('Recuperación de contraseña', () => {
    let usersService: UsersService;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let mailService: MailService;
    let prismaService: PrismaService;

    beforeEach(async () => {
      const moduleRef = await Test.createTestingModule({
        providers: [
          UsersService,
          {
            provide: PrismaService,
            useValue: {
              user: {
                findUnique: jest.fn(),
                update: jest.fn(),
              },
            },
          },
          {
            provide: MailService,
            useValue: {
              sendRecoveryCode: jest.fn(),
            },
          },
        ],
      }).compile();

      usersService = moduleRef.get<UsersService>(UsersService);
      mailService = moduleRef.get<MailService>(MailService);
      prismaService = moduleRef.get<PrismaService>(PrismaService);
    });

    describe('Solicitud de recuperación de contraseña', () => {
      it('Debe enviar el código de recuperación cuando el correo existe', async () => {
        const email = 'cliente@example.com';
        const mockUser = {
          id: 1,
          email,
          recoveryCode: null,
          recoveryCodeGenerated: null,
        };

        prismaService.user.findUnique = jest.fn().mockResolvedValue(mockUser);
        prismaService.user.update = jest.fn().mockResolvedValue({
          ...mockUser,
          recoveryCode: 'ABC123',
          recoveryCodeGenerated: new Date(),
        });

        await usersService.startPasswordRecovery(email, 'ABC123');

        expect(prismaService.user.update).toHaveBeenCalledWith({
          where: { email },
          data: expect.objectContaining({
            recoveryCode: 'ABC123',
            recoveryCodeGenerated: expect.any(Date),
          }),
        });
      });

      it('Debe manejar el correo inexistente de maneragraceful', async () => {
        const email = 'nonexistent@example.com';

        prismaService.user.findUnique = jest.fn().mockResolvedValue(null);

        await expect(
          usersService.startPasswordRecovery(email, 'ABC123'),
        ).rejects.toThrow(NotFoundException);
      });

      it('Debe no generar un nuevo código si el código existente es válido', async () => {
        const email = 'cliente@example.com';
        const mockUser = {
          id: 1,
          email,
          recoveryCode: '123ABC',
          recoveryCodeGenerated: new Date(),
        };

        prismaService.user.findUnique = jest.fn().mockResolvedValue(mockUser);

        await expect(
          usersService.startPasswordRecovery(email, '456DEF'),
        ).rejects.toThrow(ConflictException);
      });
    });

    describe('Reinicio de contraseña', () => {
      it('Debe aceptar el formato de contraseña válido', async () => {
        const email = 'cliente@example.com';
        const validPassword = 'Contraseña1';
        const mockUser = {
          id: 1,
          email,
          recoveryCode: 'ABC123',
          recoveryCodeGenerated: new Date(),
        };

        prismaService.user.findUnique = jest.fn().mockResolvedValue(mockUser);
        prismaService.user.update = jest.fn().mockResolvedValue({
          ...mockUser,
          password: expect.any(String),
        });

        const result = await usersService.updateUser(1, {
          password: validPassword,
        });
        expect(result).toBeDefined();
        expect(result.password).not.toBe(validPassword);
      });
    });
  });
});
