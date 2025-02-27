import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CreateSectionDto } from '@/courses/sections/dto/create-section.dto';
import { UpdateSectionDto } from '@/courses/sections/dto/update-section.dto';
import { SectionsService } from '@/courses/sections/sections.service';

@ApiTags('Sections')
@Controller('courses/:courseId/sections')
export class SectionsController {
	constructor(private readonly sectionsService: SectionsService) {}

	@Post()
	async create(
		@Param('courseId') courseId: string,
		@Body() createSectionDto: CreateSectionDto,
	) {
		return await this.sectionsService.create(+courseId, createSectionDto);
	}

	@Get()
	async findAll(@Param('courseId') courseId: string) {
		return await this.sectionsService.findAll(+courseId);
	}

	@Get(':id')
	async findOne(@Param('courseId') courseId: string, @Param('id') id: string) {
		return await this.sectionsService.findOne(+courseId, +id);
	}

	@Put(':id')
	async update(
		@Param('courseId') courseId: string,
		@Param('id') id: string,
		@Body() updateSectionDto: UpdateSectionDto,
	) {
		return await this.sectionsService.update(+courseId, +id, updateSectionDto);
	}

	@Delete(':id')
	async delete(@Param('courseId') courseId: string, @Param('id') id: string) {
		return await this.sectionsService.delete(+courseId, +id);
	}
}
