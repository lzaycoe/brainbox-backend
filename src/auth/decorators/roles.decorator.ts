import { SetMetadata } from '@nestjs/common';

import { Role } from '@/auth/enums/role.enum';

export const ROLE_KEY = 'roles';
export const Roles = (...roles: [Role, ...Role[]]) =>
	SetMetadata(ROLE_KEY, roles);
