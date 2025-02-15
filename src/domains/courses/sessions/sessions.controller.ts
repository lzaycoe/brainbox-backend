import {
	Body,
	Controller,
	// Delete,
	Get,
	Param,
	Post,
	// Put,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CreateSessionDto } from '@/courses/sessions/dto/create-session.dto';
// import { UpdateSessionDto } from '@/courses/sessions/dto/update-session.dto';
import { SessionsService } from '@/courses/sessions/sessions.service';

@ApiTags('Courses')
@Controller('courses/:courseId/sessions')
export class SessionsController {
	constructor(private readonly sessionsService: SessionsService) {}

	@Post()
	create(
		@Param('courseId') courseId: string,
		@Body() createSessionDto: CreateSessionDto,
	) {
		return this.sessionsService.create(+courseId, createSessionDto);
	}

	@Get()
	findAll(@Param('courseId') courseId: string) {
		return this.sessionsService.findAll(+courseId);
	}

	// @Get(':id')
	// findOne(@Param('courseId') courseId: string, @Param('id') id: string) {
	// 	return this.sessionsService.findOne(+courseId, +id);
	// }

	// @Put(':id')
	// update(
	// 	@Param('courseId') courseId: string,
	// 	@Param('id') id: string,
	// 	@Body() updateSessionDto: UpdateSessionDto,
	// ) {
	// 	return this.sessionsService.update(+courseId, +id, updateSessionDto);
	// }

	// @Delete(':id')
	// delete(@Param('courseId') courseId: string, @Param('id') id: string) {
	// 	return this.sessionsService.delete(+courseId, +id);
	// }
}
