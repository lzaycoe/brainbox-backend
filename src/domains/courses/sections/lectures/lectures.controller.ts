import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CreateLectureDto } from '@/courses/sections/lectures/dto/create-lecture.dto';
import { UpdateLectureDto } from '@/courses/sections/lectures/dto/update-lecture.dto';
import { LecturesService } from '@/courses/sections/lectures/lectures.service';

@ApiTags('Courses')
@Controller('courses/:courseId/sections/:sectionId/lectures')
export class LecturesController {
	constructor(private readonly lecturesService: LecturesService) {}

	@Post()
	create(
		@Param('courseId') courseId: string,
		@Param('sectionId') sectionId: string,
		@Body() createLectureDto: CreateLectureDto,
	) {
		return this.lecturesService.create(+courseId, +sectionId, createLectureDto);
	}

	@Get()
	findAll(
		@Param('courseId') courseId: string,
		@Param('sectionId') sectionId: string,
	) {
		return this.lecturesService.findAll(+courseId, +sectionId);
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.lecturesService.findOne(+id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateLectureDto: UpdateLectureDto) {
		return this.lecturesService.update(+id, updateLectureDto);
	}

	@Delete(':id')
	delete(@Param('id') id: string) {
		return this.lecturesService.delete(+id);
	}
}
