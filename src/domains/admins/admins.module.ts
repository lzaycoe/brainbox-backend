import { Module } from '@nestjs/common';

import { AdminsController } from '@/admins/admins.controller';
import { AdminsService } from '@/admins/admins.service';
import { PrismaService } from '@/providers/prisma.service';

@Module({
	controllers: [AdminsController],
	providers: [AdminsService, PrismaService],
	exports: [AdminsService],
})
export class AdminsModule {}
