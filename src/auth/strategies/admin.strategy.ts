import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AuthService } from '@/auth/auth.service';

@Injectable()
export class AdminStrategy extends PassportStrategy(Strategy, 'admin') {
	constructor(private readonly authService: AuthService) {
		super();
	}

	async validate(username: string, password: string) {
		const admin = await this.authService.validateAdmin(username, password);

		if (!admin) {
			throw new UnauthorizedException();
		}

		return admin;
	}
}
