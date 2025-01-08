import { Global, Module } from '@nestjs/common';
import { AuthService } from './modules/auth/auth.service';
import { UsersModule } from './modules/users/users.module';

@Global()
@Module({
  imports: [UsersModule],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthGlobalModule {}
