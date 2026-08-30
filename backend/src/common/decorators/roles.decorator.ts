import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/**
 * Restreint un endpoint a un ou plusieurs roles (ex: @Roles('Manager', 'Responsable RH')).
 * A utiliser avec RolesGuard.
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
