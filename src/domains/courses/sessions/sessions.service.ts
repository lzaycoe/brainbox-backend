import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import { CoursesService } from '@/courses/courses.service';
import { CreateSessionDto } from '@/courses/sessions/dto/create-session.dto';
// import { UpdateSessionDto } from '@/courses/sessions/dto/update-session.dto';
import { PrismaService } from '@/providers/prisma.service';

@Injectable()
export class SessionsService {
	private readonly logger = new Logger(SessionsService.name);

	constructor(
		private readonly prismaService: PrismaService,
		private readonly coursesService: CoursesService,
	) {}

	create(courseId: number, createSessionDto: CreateSessionDto) {
		const course = this.coursesService.findOne(courseId);

		if (!course) {
			throw new NotFoundException(`Course with id ${courseId} not found`);
		}

		try {
			return this.prismaService.session.create({
				data: {
					courseId,
					...createSessionDto,
				},
			});
		} catch (error) {
			this.logger.error(error);
			throw error;
		}

		// findAll(courseId: number) {}

		// findOne(courseId: number, id: number) {}

		// update(courseId: number, id: number, updateSessionDto: UpdateSessionDto) {}

		// delete(courseId: number, id: number) {}
	}
}
