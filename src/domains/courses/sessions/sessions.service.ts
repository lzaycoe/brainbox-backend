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

	async create(courseId: number, createSessionDto: CreateSessionDto) {
		const course = this.coursesService.findOne(courseId);

		if (!course) {
			throw new NotFoundException(`Course with id ${courseId} not found`);
		}

		try {
			const newSession = await this.prismaService.session.create({
				data: {
					courseId,
					...createSessionDto,
				},
			});

			this.logger.log(`Session with id '${newSession.id}' created`);
			this.logger.debug('Session', newSession);

			return newSession;
		} catch (error) {
			this.logger.error(error);
			throw error;
		}
	}

	async findAll(courseId: number) {
		const sessions = await this.prismaService.session.findMany({
			where: {
				courseId,
			},
		});

		this.logger.log(`Found ${sessions.length} sessions`);

		return sessions;
	}
}
