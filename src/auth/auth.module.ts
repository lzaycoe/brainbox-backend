import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from '@/auth/auth.controller';
import { AuthService } from '@/auth/auth.service';
import { AdminStrategy } from '@/auth/strategies/admin.strategy';
import { JwtAccessStrategy } from '@/auth/strategies/jwt-access.strategy';
import { JwtRefreshStrategy } from '@/auth/strategies/jwt-refresh.strategy';
import jwtAccessConfig from '@/configs/jwt-access.config';
import jwtRefreshConfig from '@/configs/jwt-refresh.config';
import { AdminsModule } from '@/domains/admins/admins.module';
import { ClerkClientProvider } from '@/providers/clerk.service';

@Module({
	imports: [
		ConfigModule.forFeature(jwtAccessConfig),
		ConfigModule.forFeature(jwtRefreshConfig),
		PassportModule,
		AdminsModule,
		JwtModule,
	],
	controllers: [AuthController],
	providers: [
		AuthService,
		AdminStrategy,
		JwtAccessStrategy,
		JwtRefreshStrategy,
		ClerkClientProvider,
	],
})
export class AuthModule {}
