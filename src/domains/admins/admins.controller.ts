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
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AdminsService } from '@/admins/admins.service';
import { CreateAdminDto } from '@/admins/dto/create-admin.dto';
import { UpdateAdminDto } from '@/admins/dto/update-admin.dto';
import { Roles } from '@/auth/decorators/roles.decorator';
import { Role } from '@/auth/enums/role.enum';
import { JwtAccessAuthGuard } from '@/auth/guards/jwt-access.guard';
import { RoleGuard } from '@/auth/guards/role.guard';

@ApiBearerAuth()
@ApiTags('Admins')
@Controller('admins')
@Roles(Role.ADMIN)
@UseGuards(RoleGuard)
@UseGuards(JwtAccessAuthGuard)
export class AdminsController {
	constructor(private readonly adminsService: AdminsService) {}

	@Post()
	async create(@Body() dto: CreateAdminDto) {
		return await this.adminsService.create(dto);
	}

	@Get(':id')
	async findOne(@Param('id') id: string) {
		return await this.adminsService.findOne(+id);
	}

	@Get('username/:username')
	async findByUsername(@Param('username') username: string) {
		return await this.adminsService.findByUsername(username);
	}

	@Patch(':id')
	async update(@Param('id') id: string, @Body() dto: UpdateAdminDto) {
		return await this.adminsService.update(+id, dto);
	}

	@Delete(':id')
	async remove(@Param('id') id: string) {
		return await this.adminsService.remove(+id);
	}
}
