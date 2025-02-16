import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import { CoursesService } from '@/courses/courses.service';
import { CreateSectionDto } from '@/courses/sections/dto/create-section.dto';
import { UpdateSectionDto } from '@/courses/sections/dto/update-section.dto';
import { PrismaService } from '@/providers/prisma.service';

@Injectable()
export class SectionsService {
	private readonly logger = new Logger(SectionsService.name);

	constructor(
		private readonly prismaService: PrismaService,
		private readonly coursesService: CoursesService,
	) {}

	async create(
		courseId: number,
		createSectionDto: CreateSectionDto,
	): Promise<any> {
		const course = await this.coursesService.findOne(courseId);

		if (!course) {
			this.logger.error(`Course with id ${courseId} not found`);

			throw new NotFoundException(`Course with id ${courseId} not found`);
		}

		try {
			const newSection = await this.prismaService.section.create({
				data: {
					courseId,
					...createSectionDto,
				},
			});

			this.logger.log(`Section with id '${newSection.id}' created`);
			this.logger.debug('Section', newSection);

			return newSection;
		} catch (error) {
			this.logger.error(error);
			throw error;
		}
	}

	async findAll(courseId: number): Promise<any> {
		const sections = await this.prismaService.section.findMany({
			where: {
				courseId,
			},
		});

		this.logger.log(`Found ${sections.length} Sections`);

		return sections;
	}

	async findOne(courseId: number, id: number): Promise<any> {
		const section = await this.prismaService.section.findUnique({
			where: {
				id,
				courseId,
			},
		});

		if (!section) {
			this.logger.log(`Section with id '${id}' not found`);

			throw new NotFoundException(`Section with id '${id}' not found`);
		}

		this.logger.log(`Section with id '${id}' found`);
		this.logger.debug('Section', section);

		return section;
	}

	async update(
		courseId: number,
		id: number,
		updateSectionDto: UpdateSectionDto,
	): Promise<any> {
		const section = await this.prismaService.section.findUnique({
			where: {
				id,
				courseId,
			},
		});

		if (!section) {
			this.logger.log(`Section with id '${id}' not found`);

			throw new NotFoundException(`Section with id '${id}' not found`);
		}

		try {
			const updatedSection = await this.prismaService.section.update({
				where: {
					id,
				},
				data: {
					...updateSectionDto,
				},
			});

			this.logger.log(`Section with id '${id}' updated`);
			this.logger.debug('Section', updatedSection);

			return updatedSection;
		} catch (error) {
			this.logger.error(error);
			throw error;
		}
	}

	async delete(courseId: number, id: number): Promise<any> {
		const section = await this.prismaService.section.findUnique({
			where: {
				id,
				courseId,
			},
		});

		if (!section) {
			this.logger.log(`Section with id '${id}' not found`);

			throw new NotFoundException(`Section with id '${id}' not found`);
		}

		try {
			await this.prismaService.section.delete({
				where: {
					id,
				},
			});

			this.logger.log(`Section with id '${id}' deleted`);

			return { message: `Section with id '${id}' deleted` };
		} catch (error) {
			this.logger.error(error);
			throw error;
		}
	}
}
