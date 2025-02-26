import { Module } from '@nestjs/common';

import { CoursesService } from '@/courses/courses.service';
import { LecturesModule } from '@/courses/sections/lectures/lectures.module';
import { SectionsController } from '@/courses/sections/sections.controller';
import { SectionsService } from '@/courses/sections/sections.service';
import { PrismaService } from '@/providers/prisma.service';

@Module({
	controllers: [SectionsController],
	providers: [SectionsService, PrismaService, CoursesService],
	exports: [SectionsService],
	imports: [LecturesModule],
})
export class SectionsModule {}
