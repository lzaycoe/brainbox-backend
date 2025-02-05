import {
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	Req,
	Res,
	UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiCookieAuth } from '@nestjs/swagger';
import { Request, Response } from 'express';

import { AuthService } from '@/auth/auth.service';
import { AdminLoginDto } from '@/auth/dto/auth.admin.dto';
import { AdminAuthGuard } from '@/auth/guards/admin.guard';
import { JwtRefreshAuthGuard } from '@/auth/guards/jwt-refresh.guard';
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

		res.cookie('refresh_token', refreshToken, {
			httpOnly: true,
			sameSite: 'none',
			secure: process.env.NODE_ENV == 'production',
			expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
		});

		return res.json({ access_token: accessToken });
	}

	@ApiCookieAuth()
	@HttpCode(HttpStatus.OK)
	@Post('admin/logout')
	async adminLogout(@Req() req: Request, @Res() res: Response): Promise<any> {
		const refreshToken = req.cookies['refresh_token'];

		if (refreshToken) {
			res.clearCookie('refresh_token', {
				httpOnly: true,
				sameSite: 'none',
				secure: process.env.NODE_ENV === 'production',
			});
		}

		return res.status(HttpStatus.OK).json({ message: 'Logout successful' });
	}

	@ApiCookieAuth()
	@UseGuards(JwtRefreshAuthGuard)
	@HttpCode(HttpStatus.OK)
	@Post('admin/refresh')
	async adminRefresh(@Req() req: Request): Promise<any> {
		const user = req.user as User;

		const accessToken = await this.authService.generateAccessTokenForAdmin(
			user.username,
		);

		return { access_token: accessToken };
	}
}
