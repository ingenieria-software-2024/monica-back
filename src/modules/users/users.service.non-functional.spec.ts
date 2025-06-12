import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../../providers/prisma.service';
import { User } from '@prisma/client';

describe('UsersService - Test de Rendimiento', () => {
  let service: UsersService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, PrismaService],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('deberia manejar una alta carga para getAllUsers', async () => {
    const mockUsers: User[] = Array.from({ length: 1000 }, (_, i) => ({
      id: i + 1,
      username: `user ${i + 1}`,
      email: `user${i + 1}@example.com`,
      password: 'hashedPassword',
      recoveryCode: null,
      recoveryCodeGenerated: null,
      role: 'USER',
    }));

    jest.spyOn(prismaService.user, 'findMany').mockResolvedValue(mockUsers);

    const startTime = performance.now();
    const users = await service.getAllUsers();
    const endTime = performance.now();

    expect(users).toHaveLength(1000);
    expect(endTime - startTime).toBeLessThan(1000);
  });

  it('deberia manejar una alta carga para createUser', async () => {
    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'hashedPassword',
      recoveryCode: null,
      recoveryCodeGenerated: null,
      role: 'USER',
    };

    jest.spyOn(prismaService.user, 'create').mockResolvedValue(mockUser);
    jest.spyOn(prismaService.user, 'findFirst').mockResolvedValue(null);

    const startTime = performance.now();
    const user = await service.createUser({
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'password123',
    });
    const endTime = performance.now();

    expect(user).toEqual(mockUser);
    expect(endTime - startTime).toBeLessThan(1000);
  });
});
