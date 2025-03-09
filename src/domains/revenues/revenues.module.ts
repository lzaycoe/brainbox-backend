import { Module } from '@nestjs/common';

import { PrismaService } from '@/providers/prisma.service';
import { RevenuesController } from '@/revenues/revenues.controller';
import { RevenuesService } from '@/revenues/revenues.service';

@Module({
	controllers: [RevenuesController],
	providers: [RevenuesService, PrismaService],
	exports: [RevenuesService],
})
export class RevenuesModule {}
