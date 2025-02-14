import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
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
	async findAll(@Query('page') page: string, @Query('limit') limit: string) {
		return await this.coursesService.findAll(+page, +limit);
	}

	@Get(':id')
	async findOne(@Param('id') id: string) {
		return await this.coursesService.findOne(+id);
	}

	@Get('/search/:query')
	async search(
		@Param('query') query: string,
		@Query('page') page: string,
		@Query('limit') limit: string,
	) {
		return await this.coursesService.search(query, +page, +limit);
	}

	@Put(':id')
	async update(@Param('id') id: string, @Body() dto: UpdateCourseDto) {
		return await this.coursesService.update(+id, dto);
	}
}
