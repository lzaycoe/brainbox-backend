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
import { ClerkClient, verifyToken } from '@clerk/backend';
import {
	Inject,
	Injectable,
	Logger,
	UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-custom';

import jwtAccessConfig from '@/configs/jwt-access.config';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
	Strategy,
	'jwt-access',
) {
	private readonly logger = new Logger(JwtAccessStrategy.name);

	constructor(
		@Inject(jwtAccessConfig.KEY)
		private readonly jwtAccessConfiguration: ConfigType<typeof jwtAccessConfig>,
		@Inject('ClerkClient')
		private readonly clerkClient: ClerkClient,
		private readonly jwtService: JwtService,
	) {
		super();
	}

	private async validateWithClerk(token: string) {
		try {
			const payload = await verifyToken(token, {
				secretKey: process.env.CLERK_SECRET_KEY,
			});

			const user = await this.clerkClient.users.getUser(payload.sub);

			if (!user) {
				this.logger.warn('User not found with Clerk');
				return null;
			}

			return user;
		} catch (error: any) {
			this.logger.warn(`Clerk validation failed: ${error.message}`);
			return null;
		}
	}

	private async validateWithJwt(token: string) {
		try {
			return await this.jwtService.verifyAsync(token, {
				secret: this.jwtAccessConfiguration.secret,
			});
		} catch (error: any) {
			this.logger.warn(`JWT validation failed: ${error.message}`);
			return null;
		}
	}

	async validate(req: Request) {
		const token = req.headers.authorization?.split(' ').pop();

		if (!token) {
			throw new UnauthorizedException('No token provided');
		}

		let user = await this.validateWithClerk(token);

		if (!user) {
			user = await this.validateWithJwt(token);
		}

		if (!user) {
			this.logger.error('Failed to validate token by both JWT & Clerk');
			throw new UnauthorizedException('Invalid token');
		}

		req.user = user;
		return user;
	}
}
