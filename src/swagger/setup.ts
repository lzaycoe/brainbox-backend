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
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const setupSwagger = (app: INestApplication<any>) => {
	const config = new DocumentBuilder()
		.setTitle('brainbox API doumentation')
		.setDescription('Backend for BrainBox')
		.setVersion(process.env.npm_package_version as string)
		.setLicense(
			'GPL-3.0 license',
			'https://github.com/lzaycoe/brainbox-backend/blob/main/LICENSE',
		)
		.addBearerAuth()
		.addCookieAuth('refresh_token')
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api-docs', app, document, {
		swaggerOptions: {
			tagsSorter: 'alpha',
			operationsSorter: 'method',
			syntaxHighlight: true,
			displayRequestDuration: true,
		},
	});
};
