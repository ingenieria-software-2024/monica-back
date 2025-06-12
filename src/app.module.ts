import { Module } from '@nestjs/common';
import { MainModule } from './modules/main.module';
import { AuthGlobalModule } from './auth.global.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('AUTHENTICATION_SECRET') ?? 'default_secret',
        signOptions: {
          expiresIn: '24h',
        },
      }),
    }),
    AuthGlobalModule,
    MainModule,
  ],
})
export class AppModule {}
