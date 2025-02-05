import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export default registerAs(
	'jwt-refresh',
	(): JwtModuleOptions => ({
		secret: process.env.JWT_REFRESH_TOKEN_SECRET,
		signOptions: {
			expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES,
		},
	}),
);
