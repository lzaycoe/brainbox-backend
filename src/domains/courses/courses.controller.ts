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

import { CoursesService } from '@/courses/courses.service';
import { CreateCourseDto } from '@/courses/dto/create-course.dto';
import { UpdateCourseDto } from '@/courses/dto/update-course.dto';

@ApiTags('Courses')
@Controller('courses')
export class CoursesController {
	constructor(private readonly coursesService: CoursesService) {}

	@Post()
	async create(@Body() dto: CreateCourseDto) {
		return await this.coursesService.create(dto);
	}

	@Get()
	async findAll() {
		return await this.coursesService.findAll();
	}

	@Get(':id')
	async findOne(@Param('id') id: string) {
		return await this.coursesService.findOne(+id);
	}

	@Put(':id')
	async update(@Param('id') id: string, @Body() dto: UpdateCourseDto) {
		return await this.coursesService.update(+id, dto);
	}

	@Delete(':id')
	async delete(@Param('id') id: string) {
		return await this.coursesService.delete(+id);
	}
}
