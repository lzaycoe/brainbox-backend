import { Module } from '@nestjs/common';

import { AdminsModule } from '@/admins/admins.module';
import { ChatsModule } from '@/chats/chats.module';
import { CoursesModule } from '@/courses/courses.module';
import { PaymentsModule } from '@/payments/payments.module';
import { RevenuesModule } from '@/revenues/revenues.module';
import { UsersModule } from '@/users/users.module';

@Module({
	imports: [
		AdminsModule,
		ChatsModule,
		CoursesModule,
		PaymentsModule,
		RevenuesModule,
		UsersModule,
	],
})
export class DomainsModule {}
