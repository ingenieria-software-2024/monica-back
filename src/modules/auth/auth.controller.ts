import {
  Body,
  Controller,
  Inject,
  Param,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { IAuthService } from './auth.interface';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth.login.dto';
import { AuthGuard } from 'src/pipes/auth/auth.guard';
import { AuthRecoveryDto } from './dto/auth.recovery.dto';
import { AuthRecoveryNewDto } from './dto/auth.recovery.new.dto';

@Controller('/auth')
export class AuthController {
  constructor(@Inject(AuthService) private readonly service: IAuthService) {}

  @Post('/login')
  @UsePipes(ValidationPipe)
  private async login(
    @Body() body: AuthLoginDto,
    @Req() request: Request,
  ): Promise<string> {
    return this.service.authenticate(body.username, body.password, request);
  }

  @Post('/validate')
  @UseGuards(AuthGuard)
  private async validate(
    @Body('authToken') authToken: string,
  ): Promise<boolean> {
    return this.service.validateSession(authToken);
  }

  @Post('/recovery')
  @UsePipes(ValidationPipe)
  private async recovery(@Body() body: AuthRecoveryDto): Promise<void> {
    return this.service.recoverPassword(body.email);
  }

  @Post('/recovery/:email')
  @UsePipes(ValidationPipe)
  private async changePassword(
    @Param('email') email: string,
    @Body() body: AuthRecoveryNewDto,
  ): Promise<void> {
    return this.service.changePassword(email, body.code, body.password);
  }
}
