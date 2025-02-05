import { User } from '@clerk/backend';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ROLE_KEY } from '@/auth/decorators/roles.decorator';
import { Role } from '@/auth/enums/role.enum';

@Injectable()
export class RoleGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLE_KEY, [
			context.getHandler(),
			context.getClass(),
		]);

		if (!requiredRoles) {
			return true;
		}

		const request = context.switchToHttp().getRequest();
		const user = request.user;

		if (!user) {
			return false;
		}

		const role = this.getRole(user);

		return requiredRoles.includes(role);
	}

	private getRole(user: any): Role {
		if (user?.role == Role.ADMIN) {
			return Role.ADMIN;
		}

		const clerkUser = user as User;
		const userRole = clerkUser.publicMetadata.role;

		if (userRole == 'teacher') {
			return Role.TEACHER;
		} else {
			return Role.LEARNER;
		}
	}
}
