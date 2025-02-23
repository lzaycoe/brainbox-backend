import { Module } from '@nestjs/common';

import { CoursesService } from '@/courses/courses.service';
import { OrdersController } from '@/orders/orders.controller';
import { OrdersService } from '@/orders/orders.service';
import { PrismaService } from '@/providers/prisma.service';

@Module({
	controllers: [OrdersController],
	providers: [OrdersService, PrismaService, CoursesService],
	exports: [OrdersService],
})
export class OrdersModule {}
