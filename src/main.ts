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
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';

import { AppModule } from '@/app.module';
import { setupSwagger } from '@/swagger/setup';

async function bootstrap() {
	const logger = new Logger();

	const app = await NestFactory.create(AppModule);
	const configService = app.get<ConfigService>(ConfigService);
	const isProduction = configService.get('NODE_ENV') == 'production' || false;

	// Setup logger level
	app.useLogger(
		isProduction
			? ['fatal', 'error', 'warn', 'log']
			: ['fatal', 'error', 'warn', 'log', 'debug'],
	);

	// Enable cookie parser
	app.use(cookieParser());

	// Enable validation pipe
	app.useGlobalPipes(new ValidationPipe());

	// Set global prefix
	app.setGlobalPrefix('api');

	// Setup Swagger
	setupSwagger(app);

	await app.listen(4000);

	logger.log(`Server running on ${await app.getUrl()}`);
}

bootstrap();
