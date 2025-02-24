import { Module } from '@nestjs/common';

import { CoursesService } from '@/courses/courses.service';
import { OrdersService } from '@/orders/orders.service';
import { PaymentsController } from '@/payments/payments.controller';
import { PaymentsService } from '@/payments/payments.service';
import { PrismaService } from '@/providers/prisma.service';

@Module({
	controllers: [PaymentsController],
	providers: [PaymentsService, PrismaService, OrdersService, CoursesService],
	exports: [PaymentsService],
})
export class PaymentsModule {}
