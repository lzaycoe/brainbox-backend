import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export default registerAs(
	'jwt-access',
	(): JwtModuleOptions => ({
		secret: process.env.JWT_ACCESS_TOKEN_SECRET,
		signOptions: {
			expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES,
		},
	}),
);
