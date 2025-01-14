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
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';

import { AppModule } from '@/app.module';
import { setupSwagger } from '@/swagger/setup';

// eslint-disable-next-line @typescript-eslint/no-require-imports
require('module-alias/register');

/**
 * Initializes and starts the NestJS application.
 *
 * @async
 * @function bootstrap
 * @returns {Promise<void>} A promise that resolves when the application has started.
 */
async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	// Setup cookie parser
	app.use(cookieParser());

	// Setup Swagger
	setupSwagger(app);

	await app.listen(4000);
}

bootstrap();
