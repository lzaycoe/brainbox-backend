import { Module } from '@nestjs/common';

import { CoursesController } from '@/courses/courses.controller';
import { CoursesService } from '@/courses/courses.service';
import { PrismaService } from '@/providers/prisma.service';

@Module({
	controllers: [CoursesController],
	providers: [CoursesService, PrismaService],
	exports: [CoursesService],
})
export class CoursesModule {}
