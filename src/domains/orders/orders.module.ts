import { Module } from '@nestjs/common';

import { OrdersController } from '@/orders/orders.controller';
import { OrdersService } from '@/orders/orders.service';
import { PrismaService } from '@/providers/prisma.service';

@Module({
	controllers: [OrdersController],
	providers: [OrdersService, PrismaService],
	exports: [OrdersService],
})
export class OrdersModule {}
