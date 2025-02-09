import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from 'src/modules/auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Obtain the HTTP context for the authentication token.
    const http = context.switchToHttp();

    // Read the request object from the HTTP context.
    const { authorization } = http.getRequest().headers;

    // Check if the authorization header is present.
    if (!authorization)
      throw new UnauthorizedException(
        'No tienes permisos para acceder a este recurso.',
      );

    // Check if the authorization header is valid.
    const [_, token]: Array<string> = authorization.split(' ');

    if (_.toLowerCase() !== 'Bearer') return false;

    // Check if the authorization header is a Bearer token.
    return AuthService.validateTokenStatic(token);
  }
}
