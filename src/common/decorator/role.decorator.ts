import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';

import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guard/jwt.guard';
import { RolesGuard } from '../guard/role.guard';
import { UserRole } from 'src/user/enum/user-role.enum';

export const AuthRoles = (...roles: UserRole[]) => {
    return SetMetadata('roles', roles);
};


export function Role(role?: UserRole | UserRole[]) {
    let roles = [];
    if (typeof role === 'string') roles = [role];
    else roles = role;
    return applyDecorators(
        AuthRoles(...roles),
        UseGuards(JwtAuthGuard, RolesGuard),
        ApiBearerAuth('accessToken'),
        ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    );
}
