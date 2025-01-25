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
import {
	ConflictException,
	Injectable,
	Logger,
	NotFoundException,
} from '@nestjs/common';

import { CreateAdminDto } from '@/admins/dto/create-admin.dto';
import { UpdateAdminDto } from '@/admins/dto/update-admin.dto';
import { PrismaService } from '@/providers/prisma.service';
import { hash } from '@/utils/hash.util';

@Injectable()
export class AdminsService {
	private readonly logger = new Logger(AdminsService.name);

	constructor(private readonly prismaService: PrismaService) {}

	async create(dto: CreateAdminDto): Promise<any> {
		const admin = await this.prismaService.admin.findUnique({
			where: { username: dto.username },
		});

		if (admin) {
			this.logger.log(`Admin with username '${dto.username}' already exists`);
			this.logger.debug('Admin', admin);

			throw new ConflictException('Admin already exists');
		}

		try {
			const hashedPassword = await hash(dto.password);
			const newAdmin = await this.prismaService.admin.create({
				data: { username: dto.username, hashedPassword: hashedPassword },
			});

			this.logger.log(`Admin with username '${dto.username}' created`);
			this.logger.debug('Admin', newAdmin);

			return {
				id: newAdmin.id,
				username: newAdmin.username,
				createdAt: newAdmin.createAt,
				updateAt: newAdmin.updateAt,
			};
		} catch (error: any) {
			this.logger.error(error);

			throw error;
		}
	}

	async findOne(id: number): Promise<any> {
		const admin = await this.prismaService.admin.findUnique({
			where: { id: id, deleteAt: null },
		});

		if (!admin) {
			this.logger.log(`Admin with id '${id}' not found`);

			throw new NotFoundException('Admin not found');
		}

		this.logger.log(`Admin with id '${id}' found`);
		this.logger.debug('Admin', admin);

		return {
			id: admin.id,
			username: admin.username,
			createdAt: admin.createAt,
			updateAt: admin.updateAt,
		};
	}

	async findByUsername(username: string): Promise<any> {
		const admin = await this.findByUsernameWithPassword(username);

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { hashedPassword, refreshToken, ...result } = admin;

		return result;
	}

	async findByUsernameWithPassword(username: string): Promise<any> {
		const admin = await this.prismaService.admin.findUnique({
			where: { username: username, deleteAt: null },
		});

		if (!admin) {
			this.logger.log(`Admin with username '${username}' not found`);

			throw new NotFoundException('Admin not found');
		}

		this.logger.log(`Admin with id '${username}' found`);
		this.logger.debug('Admin', admin);

		return admin;
	}

	async update(id: number, dto: UpdateAdminDto) {
		const admin = await this.prismaService.admin.findUnique({
			where: { id: id, deleteAt: null },
		});

		if (!admin) {
			this.logger.log(`Admin with id '${id}' not found`);

			throw new NotFoundException('Admin not found');
		}

		this.logger.debug('Admin', admin);

		const username = dto?.username || admin.username;

		const hashedPassword = dto?.password
			? await hash(dto.password)
			: admin.hashedPassword;

		try {
			const updatedAdmin = await this.prismaService.admin.update({
				where: { id: id },
				data: { ...admin, username: username, hashedPassword: hashedPassword },
			});

			this.logger.log(`Admin with id '${id}' updated`);
			this.logger.debug('Updated admin', updatedAdmin);
		} catch (error: any) {
			this.logger.error(error);

			throw error;
		}
	}

	async remove(id: number) {
		const admin = await this.prismaService.admin.findUnique({
			where: { id: id },
		});

		if (!admin) {
			this.logger.log(`Admin with id '${id}' not found`);

			throw new NotFoundException('Admin not found');
		}

		this.logger.debug('Admin', admin);

		if (admin.deleteAt) {
			this.logger.log(
				`Admin with username '${admin.username}' has already been soft-deleted`,
			);

			return;
		}

		try {
			const deletedAdmin = await this.prismaService.admin.update({
				where: { id: id },
				data: { ...admin, deleteAt: new Date().toISOString() },
			});

			this.logger.log(`Admin with id '${id}' deleted`);
			this.logger.debug('Deleted admin', deletedAdmin);
		} catch (error: any) {
			this.logger.error(error);

			throw error;
		}
	}

	async saveRefreshToken(username: string, refreshToken: string) {
		const admin = await this.findByUsernameWithPassword(username);

		const hasedRefreshToken = await hash(refreshToken);

		try {
			await this.prismaService.admin.update({
				where: { id: admin.id },
				data: { refreshToken: hasedRefreshToken },
			});
		} catch (error: any) {
			this.logger.error(error);

			throw error;
		}
	}
}
