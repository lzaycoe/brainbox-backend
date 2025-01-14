/*
 *  ======================================================================
 *  Copyright (C) 2025 - lzaycoe (Lazy Code)
 *  ======================================================================
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 *  ======================================================================
 */
import { SetMetadata } from '@nestjs/common';

import { Role } from '@/auth/enums/role.enum';

export const ROLE_KEY = 'roles';
/**
 * A decorator function that assigns roles to a route handler.
 *
 * @param roles - A list of roles that are allowed to access the route.
 * @returns A decorator function that sets metadata for the roles.
 *
 * @example
 * ```typescript
 * @Roles(Role.Admin, Role.User)
 * ```
 */
export const Roles = (...roles: [Role, ...Role[]]) =>
	SetMetadata(ROLE_KEY, roles);
