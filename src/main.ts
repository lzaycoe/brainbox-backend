import { NestFactory } from '@nestjs/core';

import { AppModule } from '@/app.module';

// eslint-disable-next-line @typescript-eslint/no-require-imports
require('module-alias/register');

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
