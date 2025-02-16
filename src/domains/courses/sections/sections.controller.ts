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

@ApiTags('Courses')
@Controller('courses/:courseId/sections')
export class SectionsController {
	constructor(private readonly sectionsService: SectionsService) {}

	@Post()
	create(
		@Param('courseId') courseId: string,
		@Body() createSectionDto: CreateSectionDto,
	) {
		return this.sectionsService.create(+courseId, createSectionDto);
	}

	@Get()
	findAll(@Param('courseId') courseId: string) {
		return this.sectionsService.findAll(+courseId);
	}

	@Get(':id')
	findOne(@Param('courseId') courseId: string, @Param('id') id: string) {
		return this.sectionsService.findOne(+courseId, +id);
	}

	@Put(':id')
	update(
		@Param('courseId') courseId: string,
		@Param('id') id: string,
		@Body() updateSectionDto: UpdateSectionDto,
	) {
		return this.sectionsService.update(+courseId, +id, updateSectionDto);
	}

	@Delete(':id')
	delete(@Param('courseId') courseId: string, @Param('id') id: string) {
		return this.sectionsService.delete(+courseId, +id);
	}
}
