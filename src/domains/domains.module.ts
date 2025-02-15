import { Module } from '@nestjs/common';

import { AdminsModule } from '@/admins/admins.module';
import { CoursesModule } from '@/courses/courses.module';

@Module({
	imports: [AdminsModule, CoursesModule],
})
export class DomainsModule {}
