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
			secretOrKey: jwtRefreshConfiguration.secret,
			ignoreExpiration: false,
		});
	}

	async validate(payload: JwtRefreshPayload) {
		return this.authService.validateRefreshToken(payload);
	}
}
