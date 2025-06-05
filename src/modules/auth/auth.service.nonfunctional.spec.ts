import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import { AuditUserService } from '../audit/audit.users.service';
import {
  UnauthorizedException,
  NotFoundException,
  HttpException,
} from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let usersService: UsersService;
  let mailService: MailService;
  let auditUserService: AuditUserService;

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  const mockUsersService = {
    getUserByUsernameOrEmail: jest.fn(),
    verifyPassword: jest.fn(),
    startPasswordRecovery: jest.fn(),
    updateUser: jest.fn(),
  };

  const mockMailService = {
    sendRecoveryCode: jest.fn(),
  };

  const mockAuditUserService = {
    logUserLogin: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: UsersService, useValue: mockUsersService },
        { provide: MailService, useValue: mockMailService },
        { provide: AuditUserService, useValue: mockAuditUserService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    usersService = module.get<UsersService>(UsersService);
    mailService = module.get<MailService>(MailService);
    auditUserService = module.get<AuditUserService>(AuditUserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('authenticate', () => {
    it('Prueba No Funcional: debería autenticar a un usuario exitosamente', async () => {
      const mockUser = { username: 'test', password: 'hashedPassword' };
      const mockReq = {
        ip: '127.0.0.1',
        headers: { 'user-agent': 'test-agent' },
      };

      mockUsersService.getUserByUsernameOrEmail.mockResolvedValue(mockUser);
      mockUsersService.verifyPassword.mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue('mockToken');

      const token = await authService.authenticate(
        'test',
        'password',
        mockReq as any,
      );

      expect(usersService.getUserByUsernameOrEmail).toHaveBeenCalledWith(
        'test',
      );
      expect(usersService.verifyPassword).toHaveBeenCalledWith(
        'password',
        'hashedPassword',
      );
      expect(jwtService.sign).toHaveBeenCalledWith({
        username: 'test',
        email: undefined,
        role: undefined,
      });
      expect(auditUserService.logUserLogin).toHaveBeenCalledWith(
        mockUser,
        '127.0.0.1',
        'test-agent',
      );
      expect(token).toBe('mockToken');
    });

    it('Prueba No Funcional: debería lanzar UnauthorizedException si el usuario no se encuentra', async () => {
      mockUsersService.getUserByUsernameOrEmail.mockResolvedValue(null);

      await expect(
        authService.authenticate('test', 'password'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('Prueba No Funcional: debería lanzar UnauthorizedException si la contraseña es inválida', async () => {
      const mockUser = { username: 'test', password: 'hashedPassword' };
      mockUsersService.getUserByUsernameOrEmail.mockResolvedValue(mockUser);
      mockUsersService.verifyPassword.mockResolvedValue(false);

      await expect(
        authService.authenticate('test', 'password'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('validateSession', () => {
    it('Prueba No Funcional: debería devolver verdadero para una sesión válida', async () => {
      const mockPayload = { username: 'test' };
      const mockUser = { username: 'test' };
      mockJwtService.verify.mockReturnValue(mockPayload);
      mockUsersService.getUserByUsernameOrEmail.mockResolvedValue(mockUser);

      const isValid = await authService.validateSession('mockToken');

      expect(jwtService.verify).toHaveBeenCalledWith('mockToken');
      expect(usersService.getUserByUsernameOrEmail).toHaveBeenCalledWith(
        'test',
      );
      expect(isValid).toBe(true);
    });

    it('Prueba No Funcional: debería devolver falso para una sesión inválida', async () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Token inválido');
      });

      const isValid = await authService.validateSession('invalidToken');

      expect(jwtService.verify).toHaveBeenCalledWith('invalidToken');
      expect(isValid).toBe(false);
    });
  });

  describe('recoverPassword', () => {
    it('Prueba No Funcional: debería enviar el código de recuperación exitosamente', async () => {
      const mockUser = { email: 'test@example.com', recoveryCode: null };
      mockUsersService.getUserByUsernameOrEmail.mockResolvedValue(mockUser);

      await authService.recoverPassword('test@example.com');

      expect(usersService.getUserByUsernameOrEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
      expect(usersService.startPasswordRecovery).toHaveBeenCalled();
      expect(mailService.sendRecoveryCode).toHaveBeenCalled();
    });

    it('Prueba No Funcional: debería lanzar NotFoundException si el usuario no se encuentra', async () => {
      mockUsersService.getUserByUsernameOrEmail.mockResolvedValue(null);

      await expect(
        authService.recoverPassword('test@example.com'),
      ).rejects.toThrow(NotFoundException);
    });

    it('Prueba No Funcional: debería lanzar HttpException si ya existe un código de recuperación y no ha expirado', async () => {
      const mockUser = {
        email: 'test@example.com',
        recoveryCode: '1234',
        recoveryCodeGenerated: new Date(),
      };
      mockUsersService.getUserByUsernameOrEmail.mockResolvedValue(mockUser);

      await expect(
        authService.recoverPassword('test@example.com'),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('changePassword', () => {
    it('Prueba No Funcional: debería cambiar la contraseña exitosamente', async () => {
      const mockUser = {
        email: 'test@example.com',
        recoveryCode: '1234',
        recoveryCodeGenerated: new Date(),
      };
      mockUsersService.getUserByUsernameOrEmail.mockResolvedValue(mockUser);

      await authService.changePassword(
        'test@example.com',
        '1234',
        'newPassword',
      );

      expect(usersService.updateUser).toHaveBeenCalled();
      expect(usersService.startPasswordRecovery).toHaveBeenCalledWith(
        'test@example.com',
        null,
      );
    });

    it('Prueba No Funcional: debería lanzar UnauthorizedException para un código de recuperación inválido', async () => {
      const mockUser = { email: 'test@example.com', recoveryCode: '5678' };
      mockUsersService.getUserByUsernameOrEmail.mockResolvedValue(mockUser);

      await expect(
        authService.changePassword('test@example.com', '1234', 'newPassword'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('Prueba No Funcional: debería lanzar UnauthorizedException para un código de recuperación expirado', async () => {
      const mockUser = {
        email: 'test@example.com',
        recoveryCode: '1234',
        recoveryCodeGenerated: new Date(Date.now() - 600_000), // 10 minutes ago
      };
      mockUsersService.getUserByUsernameOrEmail.mockResolvedValue(mockUser);

      await expect(
        authService.changePassword('test@example.com', '1234', 'newPassword'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
