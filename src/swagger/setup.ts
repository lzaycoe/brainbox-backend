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
import { version } from '../../package.json';
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * Sets up Swagger documentation for the given NestJS application.
 *
 * This function configures Swagger using the `DocumentBuilder` to set the title,
 * description, version, and license of the API documentation. It also adds
 * Bearer authentication support. The generated Swagger document is then used
 * to set up the Swagger module at the specified endpoint (`api-docs`).
 *
 * @param app - The NestJS application instance to set up Swagger for.
 */
export const setupSwagger = (app: INestApplication<any>) => {
	const config = new DocumentBuilder()
		.setTitle('brainbox API doumentation')
		.setDescription('Backend for BrainBox')
		.setVersion(version)
		.setLicense(
			'GPL-3.0 license',
			'https://github.com/lzaycoe/brainbox-backend/blob/main/LICENSE',
		)
		.addBearerAuth()
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
