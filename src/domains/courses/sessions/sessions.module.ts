import { Module } from '@nestjs/common';

import { SessionsController } from '@/courses/sessions/sessions.controller';
import { SessionsService } from '@/courses/sessions/sessions.service';
import { PrismaService } from '@/providers/prisma.service';

@Module({
	controllers: [SessionsController],
	providers: [SessionsService, PrismaService],
	exports: [SessionsService],
})
export class SessionsModule {}
