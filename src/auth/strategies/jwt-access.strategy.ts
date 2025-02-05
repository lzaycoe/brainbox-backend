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
