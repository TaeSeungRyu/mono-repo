import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

import { Observable } from 'rxjs';
import { Auth } from 'src/modules/user/domain/auth.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    const request: Request = context.switchToHttp().getRequest();
    const user = request?.user;
    const savedRoles: Auth[] = [];
    if (user?.roles && user.roles instanceof Array) {
      savedRoles.push(...user.roles);
    }
    if (!roles || !user || savedRoles === undefined) {
      return false;
    }
    const hasRole = () =>
      savedRoles.some((role: Auth) => roles.includes(role.authcode));
    if (!hasRole()) {
      return false;
    }
    return true;
  }
}
