import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import { CreateCourseDto } from '@/courses/dto/create-course.dto';
import { UpdateCourseDto } from '@/courses/dto/update-course.dto';
import { PrismaService } from '@/providers/prisma.service';

@Injectable()
export class CoursesService {
	private readonly logger = new Logger(CoursesService.name);

	constructor(private readonly prismaService: PrismaService) {}

	async create(dto: CreateCourseDto): Promise<any> {
		try {
			const newCourse = await this.prismaService.course.create({
				data: { ...dto },
			});

			this.logger.log(`Course with id '${newCourse.id}' created`);
			this.logger.debug('Course', newCourse);

			return newCourse;
		} catch (error: any) {
			this.logger.error(error);

			throw error;
		}
	}

	async findAll(): Promise<any> {
		const courses = await this.prismaService.course.findMany();

		this.logger.log(`Found ${courses.length} courses`);
		this.logger.debug('Courses', courses);

		return courses;
	}

	async findOne(id: number): Promise<any> {
		const course = await this.prismaService.course.findUnique({
			where: { id },
		});

		if (!course) {
			this.logger.log(`Course with id '${id}' not found`);

			throw new NotFoundException(`Course with id '${id}' not found`);
		}

		this.logger.log(`Course with id '${id}' found`);
		this.logger.debug('Course', course);

		return course;
	}

	async findAllLectures(courseId: number): Promise<any> {
		const lectures = await this.prismaService.lecture.findMany({
			where: { section: { courseId } },
		});

		if (!lectures) {
			this.logger.log(`Lectures for course with id '${courseId}' not found`);

			throw new NotFoundException(
				`Lectures for course with id '${courseId}' not found`,
			);
		}

		this.logger.log(
			`Found ${lectures.length} lectures for course with id '${courseId}'`,
		);
		this.logger.debug('Lectures', lectures);

		return lectures;
	}

	async findAllByTeacher(teacherId: number): Promise<any> {
		const courses = await this.prismaService.course.findMany({
			where: { teacherId },
		});

		if (!courses) {
			this.logger.log(`Courses for teacher with id '${teacherId}' not found`);

			throw new NotFoundException(
				`Courses for teacher with id '${teacherId}' not found`,
			);
		}

		this.logger.log(
			`Found ${courses.length} courses for teacher with id '${teacherId}'`,
		);
		this.logger.debug('Courses', courses);

		return courses;
	}

	async update(id: number, dto: UpdateCourseDto): Promise<any> {
		await this.findOne(id);

		try {
			const course = await this.prismaService.course.update({
				where: { id },
				data: { ...dto },
			});

			this.logger.log(`Course with id '${id}' updated`);
			this.logger.debug('Course', course);

			return course;
		} catch (error: any) {
			this.logger.error(error);

			throw error;
		}
	}

	async delete(id: number): Promise<any> {
		await this.findOne(id);

		try {
			await this.prismaService.course.delete({
				where: { id },
			});

			this.logger.log(`Course with id '${id}' deleted`);
			return { message: `Course with id '${id}' deleted` };
		} catch (error: any) {
			this.logger.error(error);

			throw error;
		}
	}

	async createProgress(userId: number, courseId: number) {
		const existingPayment = await this.prismaService.payment.findFirst({
			where: { userId, courseId, status: 'paid' },
		});

		if (!existingPayment) {
			this.logger.log(
				`User with id '${userId}' has not purchased course with id '${courseId}'`,
			);

			throw new NotFoundException(
				`User with id '${userId}' has not purchased course with id '${courseId}'`,
			);
		}

		const progress = await this.prismaService.progress.findUnique({
			where: { userId_courseId: { userId, courseId } },
		});

		if (progress) {
			this.logger.log(`Progress for user '${userId}' already exists`);

			return progress;
		}

		const newProgress = await this.prismaService.progress.create({
			data: {
				userId,
				courseId,
				completedLectures: [],
				sectionProgress: '{}',
				courseProgress: 0,
			},
		});

		return newProgress;
	}

	async updateProgress(userId: number, courseId: number, lectureId: number) {
		const existingPayment = await this.prismaService.payment.findFirst({
			where: { userId, courseId, status: 'paid' },
		});

		if (!existingPayment) {
			this.logger.log(
				`User with id '${userId}' has not purchased course with id '${courseId}'`,
			);

			throw new NotFoundException(
				`User with id '${userId}' has not purchased course with id '${courseId}'`,
			);
		}

		const progress = await this.prismaService.progress.findUnique({
			where: { userId_courseId: { userId, courseId } },
		});

		if (!progress) {
			this.logger.log(`Progress for user '${userId}' not found`);

			const newProgress = await this.prismaService.progress.create({
				data: {
					userId,
					courseId,
					completedLectures: [lectureId],
					sectionProgress: JSON.stringify(
						await this.calculateSectionProgress([lectureId], courseId),
					),
					courseProgress: await this.calculateCourseProgress(
						[lectureId],
						courseId,
					),
				},
			});

			return newProgress;
		}

		if (progress.completedLectures.includes(lectureId)) return progress;

		const updatedLectures = [...progress.completedLectures, lectureId];

		const updateProgress = await this.prismaService.progress.update({
			where: { userId_courseId: { userId, courseId } },
			data: {
				completedLectures: updatedLectures,
				sectionProgress: JSON.stringify(
					await this.calculateSectionProgress(updatedLectures, courseId),
				),
				courseProgress: await this.calculateCourseProgress(
					updatedLectures,
					courseId,
				),
			},
		});

		return updateProgress;
	}

	private async calculateSectionProgress(
		completedLectures: number[],
		courseId: number,
	): Promise<{ [key: number]: number }> {
		const sections = await this.prismaService.section.findMany({
			where: { courseId },
			include: { lectures: true },
		});

		const sectionProgress: { [key: number]: number } = {};

		sections.forEach((section) => {
			const totalLectures = section.lectures.length;
			const completedInSection = section.lectures.filter((l) =>
				completedLectures.includes(l.id),
			).length;

			sectionProgress[section.id] =
				totalLectures > 0 ? (completedInSection / totalLectures) * 100 : 0;
		});

		return sectionProgress;
	}

	private async calculateCourseProgress(
		completedLectures: number[],
		courseId: number,
	): Promise<number> {
		const totalLectures = await this.prismaService.lecture.count({
			where: { section: { course: { id: courseId } } },
		});

		return totalLectures > 0
			? (completedLectures.length / totalLectures) * 100
			: 0;
	}

	async getProgress(userId: number, courseId: number) {
		const progress = await this.prismaService.progress.findUnique({
			where: { userId_courseId: { userId, courseId } },
		});

		if (!progress) {
			this.logger.log(`Progress for user '${userId}' not found`);

			throw new NotFoundException(`Progress for user '${userId}' not found`);
		}

		return progress;
	}

	async getAllProgressOfUser(userId: number) {
		const progresses = await this.prismaService.progress.findMany({
			where: { userId },
		});

		if (!progresses) {
			this.logger.log(`Progresses for user '${userId}' not found`);

			throw new NotFoundException(`Progresses for user '${userId}' not found`);
		}

		return progresses;
	}
}
