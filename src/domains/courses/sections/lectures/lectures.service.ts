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

	findAll() {
		return `This action returns all lectures`;
	}

	findOne(id: number) {
		return `This action returns a #${id} lecture`;
	}

	update(id: number, updateLectureDto: UpdateLectureDto) {
		return `This action updates a #${id} ${updateLectureDto} lecture`;
	}

	delete(id: number) {
		return `This action deletes a #${id} lecture`;
	}
}
