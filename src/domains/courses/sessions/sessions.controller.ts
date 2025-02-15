import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
} from '@nestjs/common';

import { CreateSessionDto } from '@/courses/sessions/dto/create-session.dto';
import { UpdateSessionDto } from '@/courses/sessions/dto/update-session.dto';
import { SessionsService } from '@/courses/sessions/sessions.service';

@Controller('sessions')
export class SessionsController {
	constructor(private readonly sessionsService: SessionsService) {}

	@Post()
	create(@Body() createSessionDto: CreateSessionDto) {
		return this.sessionsService.create(createSessionDto);
	}

	@Get()
	findAll() {
		return this.sessionsService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.sessionsService.findOne(+id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateSessionDto: UpdateSessionDto) {
		return this.sessionsService.update(+id, updateSessionDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.sessionsService.remove(+id);
	}
}
