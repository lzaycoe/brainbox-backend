import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import payOSConfig from '@/configs/payos.config';
import { EmailService } from '@/notifies/email.service';
import { PayOSService } from '@/payments/payos.service';
import { ClerkClientProvider } from '@/providers/clerk.service';
import { PrismaService } from '@/providers/prisma.service';
import { RevenuesService } from '@/revenues/revenues.service';
import { UsersService } from '@/users/users.service';
import { WithdrawalsController } from '@/withdrawals/withdrawals.controller';
import { WithdrawalsService } from '@/withdrawals/withdrawals.service';

@Module({
	imports: [ConfigModule.forFeature(payOSConfig)],
	controllers: [WithdrawalsController],
	providers: [
		WithdrawalsService,
		PrismaService,
		RevenuesService,
		EmailService,
		UsersService,
		PayOSService,
		ClerkClientProvider,
	],
	exports: [WithdrawalsService],
})
export class WithdrawalsModule {}
