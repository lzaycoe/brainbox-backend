import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import { CreateLectureDto } from '@/courses/sections/lectures/dto/create-lecture.dto';
import { UpdateLectureDto } from '@/courses/sections/lectures/dto/update-lecture.dto';
import { SectionsService } from '@/courses/sections/sections.service';
import { PrismaService } from '@/providers/prisma.service';

@Injectable()
export class LecturesService {
	private readonly logger = new Logger(LecturesService.name);

	constructor(
		private readonly prismaService: PrismaService,
		private readonly sectionsService: SectionsService,
	) {}

	async create(
		courseId: number,
		sectionId: number,
		createLectureDto: CreateLectureDto,
	): Promise<any> {
		const section = await this.sectionsService.findOne(courseId, sectionId);

		if (!section) {
			this.logger.error(`Section with id ${sectionId} not found`);

			throw new NotFoundException(`Section with id ${sectionId} not found`);
		}

		try {
			const newLecture = await this.prismaService.lecture.create({
				data: {
					sectionId,
					...createLectureDto,
				},
			});

			this.logger.log(`Lecture with id '${newLecture.id}' created`);
			this.logger.debug('Lecture', newLecture);

			return newLecture;
		} catch (error) {
			this.logger.error(error);
			throw error;
		}
	}

	async findAll(courseId: number, sectionId: number): Promise<any> {
		const lectures = await this.prismaService.lecture.findMany({
			where: {
				sectionId,
				section: {
					courseId,
				},
			},
		});

		this.logger.log(`Found ${lectures.length} Lectures`);

		return lectures;
	}

	async findOne(courseId: number, sectionId: number, id: number): Promise<any> {
		const lecture = await this.prismaService.lecture.findUnique({
			where: {
				id,
				sectionId,
				section: {
					courseId,
				},
			},
		});

		if (!lecture) {
			this.logger.log(`Lecture with id '${id}' not found`);

			throw new NotFoundException(`Lecture with id '${id}' not found`);
		}

		this.logger.log(`Lecture with id '${id}' found`);
		this.logger.debug('Lecture', lecture);

		return lecture;
	}

	update(id: number, updateLectureDto: UpdateLectureDto) {
		return `This action updates a #${id} ${updateLectureDto} lecture`;
	}

	delete(id: number) {
		return `This action deletes a #${id} lecture`;
	}
}
