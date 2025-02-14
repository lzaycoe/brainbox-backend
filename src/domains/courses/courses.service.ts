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

	async findAll(page: number = 1, limit: number = 10): Promise<any> {
		try {
			const skip = (page - 1) * limit;
			const courses = await this.prismaService.course.findMany({
				skip,
				take: limit,
			});

			this.logger.log(`${courses.length} courses found`);
			this.logger.debug('Courses', courses);

			return courses;
		} catch (error: any) {
			this.logger.error(error);

			throw error;
		}
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

	async search(
		query: string,
		page: number = 1,
		limit: number = 10,
	): Promise<any> {
		try {
			const skip = (page - 1) * limit;
			const courses = await this.prismaService.course.findMany({
				where: {
					OR: [
						{ title: { contains: query, mode: 'insensitive' } },
						{ description: { contains: query, mode: 'insensitive' } },
						{ tag: { contains: query, mode: 'insensitive' } },
					],
				},
				skip,
				take: limit,
			});

			this.logger.log(`${courses.length} courses found`);
			this.logger.debug('Courses', courses);

			return courses;
		} catch (error: any) {
			this.logger.error(error);

			throw error;
		}
	}

	async update(id: number, dto: UpdateCourseDto): Promise<any> {
		const course = await this.prismaService.course.findUnique({
			where: { id },
		});

		if (!course) {
			this.logger.log(`Course with id '${id}' not found`);

			throw new NotFoundException(`Course with id '${id}' not found`);
		}

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
}
