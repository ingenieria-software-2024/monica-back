import { Global, Module } from '@nestjs/common';
import { AuthService } from './modules/auth/auth.service';
import { UsersModule } from './modules/users/users.module';
import { MailModule } from './modules/mail/mail.module';
import { AuditModule } from './modules/audit/audit.module';

@Global()
@Module({
  imports: [UsersModule, MailModule, AuditModule],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthGlobalModule {}
