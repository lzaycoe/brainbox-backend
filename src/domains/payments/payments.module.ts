import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import payOSConfig from '@/configs/payos.config';
import { CoursesService } from '@/courses/courses.service';
import { PaymentsController } from '@/payments/payments.controller';
import { PaymentsService } from '@/payments/payments.service';
import { PayOSService } from '@/payments/payos.service';
import { ClerkClientProvider } from '@/providers/clerk.service';
import { PrismaService } from '@/providers/prisma.service';
import { RevenuesService } from '@/revenues/revenues.service';
import { UsersModule } from '@/users/users.module';

@Module({
	imports: [ConfigModule.forFeature(payOSConfig), UsersModule],
	controllers: [PaymentsController],
	providers: [
		PaymentsService,
		PrismaService,
		CoursesService,
		PayOSService,
		RevenuesService,
		ClerkClientProvider,
	],
	exports: [PaymentsService],
})
export class PaymentsModule {}
