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
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * The `PrismaService` class extends the `PrismaClient` and implements the `OnModuleInit` interface.
 * This service is responsible for managing the connection to the Prisma database.
 *
 * @class
 * @extends {PrismaClient}
 * @implements {OnModuleInit}
 *
 * @method onModuleInit
 * This method is called when the module is initialized. It establishes a connection to the Prisma database.
 *
 * @example
 * ```typescript
 * import { PrismaService } from './prisma.service';
 *
 * @Injectable()
 * export class AppService {
 *   constructor(private readonly prismaService: PrismaService) {}
 *
 *   async getData() {
 *     return this.prismaService.user.findMany();
 *   }
 * }
 * ```
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
	async onModuleInit() {
		await this.$connect();
	}
}
