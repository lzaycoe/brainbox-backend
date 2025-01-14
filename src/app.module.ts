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
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { MorganMiddleware } from '@/middlewares/morgan.middleware';

/**
 * AppModule is the root module of the application.
 * It imports the ConfigModule and sets it as a global module.
 *
 * @module AppModule
 *
 * @class
 * @implements {NestModule}
 */
@Module({
	imports: [ConfigModule.forRoot({ isGlobal: true })],
	controllers: [],
	providers: [],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(MorganMiddleware).forRoutes('*');
	}
}
