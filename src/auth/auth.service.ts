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
import { Injectable, Logger } from '@nestjs/common';

import { AdminsService } from '@/admins/admins.service';
import { verify } from '@/utils/hash.util';

@Injectable()
export class AuthService {
	private readonly logger = new Logger(AuthService.name);

	constructor(private readonly adminsService: AdminsService) {}

	async validateAdmin(username: string, password: string) {
		try {
			const admin =
				await this.adminsService.findByUsernameWithPassword(username);

			if (!admin) {
				return null;
			}

			const isPasswordValid = await verify(admin.hashedPassword, password);

			if (!isPasswordValid) {
				this.logger.warn(`Invalid password for admin '${username}'`);

				return null;
			}

			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { hashedPassword, ...result } = admin;
			return result;
		} catch (error: any) {
			this.logger.error(error.message);

			return null;
		}
	}
}
