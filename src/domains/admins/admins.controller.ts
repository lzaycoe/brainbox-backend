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
