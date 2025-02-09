import {
  Body,
  Controller,
  Inject,
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
import { Request } from 'express';

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
}
