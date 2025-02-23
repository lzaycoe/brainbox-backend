import { Module } from '@nestjs/common';

import { PaymentsController } from '@/payments/payments.controller';
import { PaymentsService } from '@/payments/payments.service';
import { PrismaService } from '@/providers/prisma.service';

@Module({
	controllers: [PaymentsController],
	providers: [PaymentsService, PrismaService],
	exports: [PaymentsService],
})
export class PaymentsModule {}
