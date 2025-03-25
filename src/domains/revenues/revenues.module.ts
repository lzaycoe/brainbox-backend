import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import payOSConfig from '@/configs/payos.config';
import { PaymentsModule } from '@/payments/payments.module';
import { PrismaService } from '@/providers/prisma.service';
import { RevenuesController } from '@/revenues/revenues.controller';
import { RevenuesService } from '@/revenues/revenues.service';
import { UsersModule } from '@/users/users.module';

@Module({
	imports: [ConfigModule.forFeature(payOSConfig), UsersModule, PaymentsModule],
	controllers: [RevenuesController],
	providers: [RevenuesService, PrismaService],
	exports: [RevenuesService],
})
export class RevenuesModule {}
