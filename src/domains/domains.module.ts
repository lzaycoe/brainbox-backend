import { Module } from '@nestjs/common';

import { AdminsModule } from '@/admins/admins.module';
import { CoursesModule } from '@/courses/courses.module';
import { PaymentsModule } from '@/payments/payments.module';

@Module({
	imports: [AdminsModule, CoursesModule, PaymentsModule],
})
export class DomainsModule {}
