import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from '@/auth/auth.module';
import corsConfig from '@/configs/cors.config';
import { DomainsModule } from '@/domains/domains.module';
import { MorganMiddleware } from '@/middlewares/morgan.middleware';

@Module({
	imports: [
		ConfigModule.forRoot({ load: [corsConfig], isGlobal: true }),
		AuthModule,
		DomainsModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(MorganMiddleware).forRoutes('*');
	}
}
