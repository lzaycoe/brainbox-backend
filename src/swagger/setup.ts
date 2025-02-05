import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { version } from '~/package.json';

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
