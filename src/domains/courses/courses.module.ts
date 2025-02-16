import { Module } from '@nestjs/common';

import { CoursesController } from '@/courses/courses.controller';
import { CoursesService } from '@/courses/courses.service';
import { SectionsModule } from '@/courses/sections/sections.module';
import { PrismaService } from '@/providers/prisma.service';

@Module({
	controllers: [CoursesController],
	providers: [CoursesService, PrismaService],
	exports: [CoursesService],
	imports: [SectionsModule],
})
export class CoursesModule {}
