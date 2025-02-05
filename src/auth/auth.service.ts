import {
	Inject,
	Injectable,
	Logger,
	UnauthorizedException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { AdminsService } from '@/admins/admins.service';
import { JwtRefreshPayload } from '@/auth/interfaces/jwt-refresh-payload.interface';
import jwtAccessConfig from '@/configs/jwt-access.config';
import jwtRefreshConfig from '@/configs/jwt-refresh.config';
import { verify } from '@/utils/hash.util';

@Injectable()
export class AuthService {
	private readonly logger = new Logger(AuthService.name);

	constructor(
		@Inject(jwtAccessConfig.KEY)
		private readonly jwtAccessConfiguration: ConfigType<typeof jwtAccessConfig>,
		@Inject(jwtRefreshConfig.KEY)
		private readonly jwtRefreshConfiguration: ConfigType<
			typeof jwtRefreshConfig
		>,
		private readonly adminsService: AdminsService,
		private readonly jwtService: JwtService,
	) {}

	async validateAdmin(username: string, password: string) {
		try {
			const admin =
				await this.adminsService.findByUsernameWithPassword(username);

			if (!admin) {
				return null;
			}

			const isPasswordValid = await verify(admin.hashedPassword, password);

			if (!isPasswordValid) {
				this.logger.warn(`Invalid password for admin '${username}'`);

				return null;
			}

			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { hashedPassword, ...result } = admin;
			return result;
		} catch (error: any) {
			this.logger.error(error.message);

			return null;
		}
	}

	async validateRefreshToken(payload: JwtRefreshPayload) {
		const admin = await this.adminsService.findByUsername(payload.sub);

		const now = Math.floor(Date.now() / 1000);

		if (now <= payload.iat || now >= payload.exp) {
			throw new UnauthorizedException('Invalid refresh token');
		}

		return admin;
	}

	async generateAccessTokenForAdmin(username: string) {
		const payload = { sub: username, role: 'admin' };

		return await this.jwtService.signAsync(payload, {
			secret: this.jwtAccessConfiguration.secret,
			expiresIn: this.jwtAccessConfiguration.signOptions?.expiresIn,
		});
	}

	async generateRefreshTokenForAdmin(username: string) {
		const payload = { sub: username, role: 'admin' };

		const token = await this.jwtService.signAsync(payload, {
			secret: this.jwtRefreshConfiguration.secret,
			expiresIn: this.jwtRefreshConfiguration.signOptions?.expiresIn,
		});

		return token;
	}
}
