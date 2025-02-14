import { Injectable, Logger } from '@nestjs/common';

import { CreateCourseDto } from '@/courses/dto/create-course.dto';
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

	async findAll(page: number = 1, limit: number = 2): Promise<any> {
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
}
