import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from './roles.guard';

export function Roles(...arg: any) {
  return applyDecorators(
    UseGuards(AuthGuard('jwt'), RolesGuard),
    SetMetadata('roles', arg),
  );
}
