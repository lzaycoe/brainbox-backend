import { Module } from '@nestjs/common';

import { AdminsModule } from '@/admins/admins.module';
import { ChatsModule } from '@/chats/chats.module';
import { CoursesModule } from '@/courses/courses.module';
import { PaymentsModule } from '@/payments/payments.module';
import { UsersModule } from '@/users/users.module';

@Module({
	imports: [
		AdminsModule,
		CoursesModule,
		PaymentsModule,
		UsersModule,
		ChatsModule,
	],
})
export class DomainsModule {}
