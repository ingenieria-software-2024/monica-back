import {
  Body,
  Controller,
  Inject,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { IAuthService } from './auth.interface';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth.login.dto';

@Controller('/auth')
export class AuthController {
  constructor(@Inject(AuthService) private readonly service: IAuthService) {}

  @Post('/login')
  @UsePipes(ValidationPipe)
  private async login(@Body() body: AuthLoginDto): Promise<string> {
    return this.service.authenticate(body.username, body.password);
  }

  @Post('/validate')
  private async validate(
    @Body('authToken') authToken: string,
  ): Promise<boolean> {
    return this.service.validateSession(authToken);
  }
}
