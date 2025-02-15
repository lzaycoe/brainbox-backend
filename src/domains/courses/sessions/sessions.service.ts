import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import { CoursesService } from '@/courses/courses.service';
import { CreateSessionDto } from '@/courses/sessions/dto/create-session.dto';
import { UpdateSessionDto } from '@/courses/sessions/dto/update-session.dto';
import { PrismaService } from '@/providers/prisma.service';

@Injectable()
export class SessionsService {
	private readonly logger = new Logger(SessionsService.name);

	constructor(
		private readonly prismaService: PrismaService,
		private readonly coursesService: CoursesService,
	) {}

	async create(
		courseId: number,
		createSessionDto: CreateSessionDto,
	): Promise<any> {
		const course = await this.coursesService.findOne(courseId);

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

	async findAll(courseId: number): Promise<any> {
		const sessions = await this.prismaService.session.findMany({
			where: {
				courseId,
			},
		});

		this.logger.log(`Found ${sessions.length} sessions`);

		return sessions;
	}

	async findOne(courseId: number, id: number): Promise<any> {
		const session = await this.prismaService.session.findUnique({
			where: {
				id,
				courseId,
			},
		});

		if (!session) {
			this.logger.log(`Session with id '${id}' not found`);

			throw new NotFoundException(`Session with id '${id}' not found`);
		}

		this.logger.log(`Session with id '${id}' found`);
		this.logger.debug('Session', session);

		return session;
	}

	async update(
		courseId: number,
		id: number,
		updateSessionDto: UpdateSessionDto,
	): Promise<any> {
		const session = await this.prismaService.session.findUnique({
			where: {
				id,
				courseId,
			},
		});

		if (!session) {
			this.logger.log(`Session with id '${id}' not found`);

			throw new NotFoundException(`Session with id '${id}' not found`);
		}

		try {
			const updatedSession = await this.prismaService.session.update({
				where: {
					id,
				},
				data: {
					...updateSessionDto,
				},
			});

			this.logger.log(`Session with id '${id}' updated`);
			this.logger.debug('Session', updatedSession);

			return updatedSession;
		} catch (error) {
			this.logger.error(error);
			throw error;
		}
	}

	async delete(courseId: number, id: number): Promise<any> {
		const session = await this.prismaService.session.findUnique({
			where: {
				id,
				courseId,
			},
		});

		if (!session) {
			this.logger.log(`Session with id '${id}' not found`);

			throw new NotFoundException(`Session with id '${id}' not found`);
		}

		try {
			await this.prismaService.session.delete({
				where: {
					id,
				},
			});

			this.logger.log(`Session with id '${id}' deleted`);

			return { message: `Session with id '${id}' deleted` };
		} catch (error) {
			this.logger.error(error);
			throw error;
		}
	}
}
