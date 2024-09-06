import {
  Injectable,
  CanActivate,
  UnauthorizedException,
  ExecutionContext,
} from '@nestjs/common';
import { AuthKeycloakService } from './auth-keycloak.service';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtKeyAuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthKeycloakService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('No authorization header found');
    }
    const [, token] = authHeader.split(' ');
    try {
      const decodeToken = await this.authService.verifyToken(token);
      const useRole = decodeToken.realm_access.roles || [];
      return requiredRoles.some((role) => useRole.includes(role));
      // return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
