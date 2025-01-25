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
import {
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	Req,
	Res,
	UseGuards,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { Request, Response } from 'express';

import { AuthService } from '@/auth/auth.service';
import { AdminLoginDto } from '@/auth/dto/auth.admin.dto';
import { AdminAuthGuard } from '@/auth/guards/admin.guard';
import { User } from '@/auth/interfaces/user.interface';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@UseGuards(AdminAuthGuard)
	@HttpCode(HttpStatus.OK)
	@Post('admin/login')
	@ApiBody({ type: AdminLoginDto })
	async adminLogin(@Req() req: Request, @Res() res: Response): Promise<any> {
		const user = req.user as User;

		const [accessToken, refreshToken] = await Promise.all([
			this.authService.generateAccessTokenForAdmin(user.username),
			this.authService.generateRefreshTokenForAdmin(user.username),
		]);

		const isProduction = process.env.NODE_ENV == 'production';

		res.cookie('refresh_token', refreshToken, {
			httpOnly: true,
			sameSite: 'none',
			secure: isProduction,
			expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
		});

		return res.json({ access_token: accessToken });
	}
}
