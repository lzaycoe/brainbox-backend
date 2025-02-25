import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import payOSConfig from '@/configs/payos.config';
import { CoursesService } from '@/courses/courses.service';
import { OrdersService } from '@/orders/orders.service';
import { PaymentsController } from '@/payments/payments.controller';
import { PaymentsService } from '@/payments/payments.service';
import { PrismaService } from '@/providers/prisma.service';

@Module({
	imports: [ConfigModule.forFeature(payOSConfig)],
	controllers: [PaymentsController],
	providers: [PaymentsService, PrismaService, OrdersService, CoursesService],
	exports: [PaymentsService],
})
export class PaymentsModule {}
