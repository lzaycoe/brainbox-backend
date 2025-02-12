import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthService } from '@/auth/auth.service';
import { JwtRefreshPayload } from '@/auth/interfaces/jwt-refresh-payload.interface';
import jwtRefreshConfig from '@/configs/jwt-refresh.config';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
	Strategy,
	'jwt-refresh',
) {
	constructor(
		@Inject(jwtRefreshConfig.KEY)
		private readonly jwtRefreshConfiguration: ConfigType<
			typeof jwtRefreshConfig
		>,
		private readonly authService: AuthService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(request: Request) => request.cookies?.refresh_token,
			]),
			secretOrKey: jwtRefreshConfiguration.secret!,
			ignoreExpiration: false,
		});
	}

	async validate(payload: JwtRefreshPayload) {
		return this.authService.validateRefreshToken(payload);
	}
}
