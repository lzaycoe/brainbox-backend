import { Module } from '@nestjs/common';

import { AdminsModule } from '@/admins/admins.module';
import { ChatsModule } from '@/chats/chats.module';
import { CoursesModule } from '@/courses/courses.module';
import { PaymentsModule } from '@/payments/payments.module';
import { RevenuesModule } from '@/revenues/revenues.module';
import { UsersModule } from '@/users/users.module';
import { WithdrawalsModule } from '@/withdrawals/withdrawals.module';

@Module({
	imports: [
		AdminsModule,
		ChatsModule,
		CoursesModule,
		PaymentsModule,
		RevenuesModule,
		UsersModule,
		WithdrawalsModule,
	],
})
export class DomainsModule {}
