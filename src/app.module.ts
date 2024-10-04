import { Module } from '@nestjs/common';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [UsersModule],
})
export class AppModule {}
