import { Global, Module } from '@nestjs/common';
import { PrismaModule } from 'src/providers/prisma.module';
import { AuditProductService } from './audit.products.service';
import { AuditUserService } from './audit.users.service';

@Global()
@Module({
  imports: [PrismaModule],
  providers: [AuditProductService, AuditUserService],
  exports: [AuditProductService, AuditUserService],
})
export class AuditModule {}
