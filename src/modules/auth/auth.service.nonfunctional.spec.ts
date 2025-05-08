// src/modules/auth/auth.service.test.ts
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
    it('should authenticate a user successfully', async () => {
      const mockUser = { username: 'test', password: 'hashedPassword' };
      const mockReq = {
        ip: '127.0.0.1',
        headers: { 'user-agent': 'test-agent' },
      }; // Mocked request object

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

    it('should throw UnauthorizedException if user is not found', async () => {
      mockUsersService.getUserByUsernameOrEmail.mockResolvedValue(null);

      await expect(
        authService.authenticate('test', 'password'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      const mockUser = { username: 'test', password: 'hashedPassword' };
      mockUsersService.getUserByUsernameOrEmail.mockResolvedValue(mockUser);
      mockUsersService.verifyPassword.mockResolvedValue(false);

      await expect(
        authService.authenticate('test', 'password'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('validateSession', () => {
    it('should return true for a valid session', async () => {
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

    it('should return false for an invalid session', async () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const isValid = await authService.validateSession('invalidToken');

      expect(jwtService.verify).toHaveBeenCalledWith('invalidToken');
      expect(isValid).toBe(false);
    });
  });

  describe('recoverPassword', () => {
    it('should send recovery code successfully', async () => {
      const mockUser = { email: 'test@example.com', recoveryCode: null };
      mockUsersService.getUserByUsernameOrEmail.mockResolvedValue(mockUser);

      await authService.recoverPassword('test@example.com');

      expect(usersService.getUserByUsernameOrEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
      expect(usersService.startPasswordRecovery).toHaveBeenCalled();
      expect(mailService.sendRecoveryCode).toHaveBeenCalled();
    });

    it('should throw NotFoundException if user is not found', async () => {
      mockUsersService.getUserByUsernameOrEmail.mockResolvedValue(null);

      await expect(
        authService.recoverPassword('test@example.com'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw HttpException if recovery code already exists and is not expired', async () => {
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
    it('should change password successfully', async () => {
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

    it('should throw UnauthorizedException for invalid recovery code', async () => {
      const mockUser = { email: 'test@example.com', recoveryCode: '5678' };
      mockUsersService.getUserByUsernameOrEmail.mockResolvedValue(mockUser);

      await expect(
        authService.changePassword('test@example.com', '1234', 'newPassword'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for expired recovery code', async () => {
      const mockUser = {
        email: 'test@example.com',
        recoveryCode: '1234',
        recoveryCodeGenerated: new Date(Date.now() - 600_000),
      };
      mockUsersService.getUserByUsernameOrEmail.mockResolvedValue(mockUser);

      await expect(
        authService.changePassword('test@example.com', '1234', 'newPassword'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
