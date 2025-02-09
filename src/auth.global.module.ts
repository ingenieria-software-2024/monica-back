import { Global, Module } from '@nestjs/common';
import { AuthService } from './modules/auth/auth.service';
import { UsersModule } from './modules/users/users.module';
import { MailModule } from './modules/mail/mail.module';

@Global()
@Module({
  imports: [UsersModule, MailModule],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthGlobalModule {}
