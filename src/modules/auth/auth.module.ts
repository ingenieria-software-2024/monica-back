import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('AUTHENTICATION_SECRET') ?? 'default_secret',
        signOptions: {
          expiresIn: '24h',
        },
      }),
    }),
    UsersModule,
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
