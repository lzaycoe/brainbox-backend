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
}
