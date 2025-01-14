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
import { clerkClient, verifyToken } from '@clerk/express';
import {
	CanActivate,
	ExecutionContext,
	Injectable,
	Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ROLE_KEY } from '@/auth/decorators/roles.decorator';
import { Role } from '@/auth/enums/role.enum';

/**
 * @class AuthGuard
 * @implements {CanActivate}
 * @description
 * AuthGuard is a guard that implements the CanActivate interface to protect routes by verifying user sessions and roles.
 * It checks for a valid session cookie, verifies the session token, and ensures the user has the required roles to access the route.
 *
 * @example
 * // Usage in a controller
 * @UseGuards(AuthGuard)
 * @Get('protected-route')
 * async getProtectedRoute() {
 *   // Your protected route logic here
 * }
 */
@Injectable()
export class AuthGuard implements CanActivate {
	/**
	 * A logger instance for the AuthGuard class.
	 * This logger is used to log messages related to authentication guard operations.
	 *
	 * @private
	 * @readonly
	 */
	private readonly logger = new Logger(AuthGuard.name);

	/**
	 * Creates an instance of AuthGuard.
	 *
	 * @param {Reflector} reflector - An instance of Reflector used to access metadata.
	 */
	constructor(private readonly reflector: Reflector) {}

	/**
	 * Determines whether a request has the necessary permissions to proceed.
	 *
	 * This method is an implementation of the `CanActivate` interface, which is used
	 * by NestJS guards to control access to route handlers. It checks for the presence
	 * of a session cookie, verifies the session, and ensures the user has the required roles.
	 *
	 * @param {ExecutionContext} context - The execution context which provides details about the current request.
	 * @returns {Promise<boolean>} - A promise that resolves to `true` if the request is authorized, otherwise `false`.
	 *
	 */
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const session = this.extractSessionCookie(request);
		const header = this.extractAuthorizationHeader(request);

		const token = session || header;
		if (!token) {
			this.logger.error(
				'Unauthorized access: No valid session or header token found',
			);
			return false;
		}

		const userId = await this.verifySession(token);
		if (!userId) {
			return false;
		}

		const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLE_KEY, [
			context.getHandler(),
			context.getClass(),
		]);

		const hasRequiredRole = await this.checkUserRole(userId, requiredRoles);
		return hasRequiredRole;
	}

	/**
	 * Extracts the session cookie from the request object.
	 *
	 * @param request - The request object containing cookies.
	 * @returns The value of the session cookie if it exists, otherwise null.
	 */
	private extractSessionCookie(request: any): string | null {
		return request.cookies?.__session || null;
	}

	/**
	 * Extracts the Authorization header from the given request object.
	 *
	 * @param request - The request object containing headers.
	 * @returns The value of the Authorization header if it exists, otherwise null.
	 */
	private extractAuthorizationHeader(request: any): string | null {
		return request.headers?.authorization || null;
	}

	/**
	 * Verifies the provided session token.
	 *
	 * @param {string} session - The session token to verify.
	 * @returns {Promise<string | null>} - A promise that resolves to the subject (sub) of the decoded token if valid, or null if the token is invalid or expired.
	 */
	private async verifySession(session: string): Promise<string | null> {
		try {
			const decoded = await verifyToken(session, {
				secretKey: process.env.CLERK_SECRET_KEY,
			});
			this.logger.debug('Token decoded successfully', decoded);

			// Validate token expiration time
			const currentTime = Math.floor(Date.now() / 1000);
			if (decoded.exp < currentTime || decoded.nbf > currentTime) {
				this.logger.error(
					'Unauthorized access: Token has expired or is not yet valid',
				);
				return null;
			}

			return decoded.sub;
		} catch (err) {
			this.logger.error('Error verifying session token', err);
			return null;
		}
	}

	/**
	 * Checks if the user has one of the required roles.
	 *
	 * @param userId - The ID of the user to check.
	 * @param requiredRoles - An array of roles that are required.
	 * @returns A promise that resolves to a boolean indicating whether the user has one of the required roles.
	 */
	private async checkUserRole(
		userId: string,
		requiredRoles: Role[],
	): Promise<boolean> {
		try {
			const user = await clerkClient.users.getUser(userId);
			const userRole = user.publicMetadata?.role;

			if (!userRole) {
				this.logger.error('User role not found');
				return false;
			}

			this.logger.debug('User role:', userRole);
			return requiredRoles.some((role) => role === userRole);
		} catch (err) {
			this.logger.error('Error fetching user or role', err);
			return false;
		}
	}
}
