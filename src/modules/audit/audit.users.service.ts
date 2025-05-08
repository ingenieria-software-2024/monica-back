import { Injectable, Logger } from '@nestjs/common';
import { IAuditUserService } from './audit.users.interface';
import { User, AuditUserLogin } from '@prisma/client';
import { PrismaService } from 'src/providers/prisma.service';

@Injectable()
export class AuditUserService implements IAuditUserService {
  readonly #logger = new Logger(AuditUserService.name);

  constructor(private readonly prisma: PrismaService) {}

  async logUserLogin(
    user: User,
    ipAddress: string,
    userAgent: string,
    os?: string,
  ): Promise<AuditUserLogin> {
    this.#logger.debug(
      `User logon at ${new Date().toISOString()} from ${user?.email ?? user?.username ?? 'Unknwon'}`,
    );

    return await this.prisma.auditUserLogin.create({
      data: {
        userId: user.id,
        ip: ipAddress,
        browser: userAgent,
        os: os ?? 'Unknown',
      },
    });
  }
}
