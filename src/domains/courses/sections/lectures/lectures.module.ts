import { Module } from '@nestjs/common';

import { LecturesController } from '@/courses/sections/lectures/lectures.controller';
import { LecturesService } from '@/courses/sections/lectures/lectures.service';
import { SectionsService } from '@/courses/sections/sections.service';
import { PrismaService } from '@/providers/prisma.service';

@Module({
	controllers: [LecturesController],
	providers: [LecturesService, PrismaService, SectionsService],
	exports: [LecturesService],
})
export class LecturesModule {}
