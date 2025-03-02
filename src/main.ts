import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { IoAdapter } from '@nestjs/platform-socket.io';
import cookieParser from 'cookie-parser';

import { AppModule } from '@/app.module';
import { setupSwagger } from '@/swagger/setup';

async function bootstrap() {
	const logger = new Logger();

	const app = await NestFactory.create(AppModule, { rawBody: true });
	const configService = app.get<ConfigService>(ConfigService);
	const corsConfig = configService.get('cors-config');
	const isProduction = configService.get('NODE_ENV') == 'production' || false;

	// Setup logger level
	app.useLogger(
		isProduction
			? ['fatal', 'error', 'warn', 'log']
			: ['fatal', 'error', 'warn', 'log', 'debug'],
	);

	// Enable CORS
	app.enableCors(isProduction ? corsConfig : { origin: '*' });

	// Enable cookie parser
	app.use(cookieParser());

	// Enable validation pipe
	app.useGlobalPipes(new ValidationPipe());

	// Enable WebSocket
	app.useWebSocketAdapter(new IoAdapter(app));

	// Setup Swagger
	setupSwagger(app);

	await app.listen(4000);

	logger.log(`Server running on ${await app.getUrl()}`);
}

bootstrap();
