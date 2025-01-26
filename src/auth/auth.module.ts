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
