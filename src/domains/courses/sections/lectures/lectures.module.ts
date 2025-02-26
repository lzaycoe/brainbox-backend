import { Module } from '@nestjs/common';

import { CoursesService } from '@/courses/courses.service';
import { LecturesController } from '@/courses/sections/lectures/lectures.controller';
import { LecturesService } from '@/courses/sections/lectures/lectures.service';
import { SectionsService } from '@/courses/sections/sections.service';
import { PrismaService } from '@/providers/prisma.service';

@Module({
	controllers: [LecturesController],
	providers: [LecturesService, PrismaService, SectionsService, CoursesService],
	exports: [LecturesService],
})
export class LecturesModule {}
