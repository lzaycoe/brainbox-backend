import { Module } from '@nestjs/common';

import { ClerkClientProvider } from '@/providers/clerk.service';
import { PrismaService } from '@/providers/prisma.service';
import { UsersController } from '@/users/users.controller';
import { UsersService } from '@/users/users.service';

@Module({
	controllers: [UsersController],
	providers: [UsersService, PrismaService, ClerkClientProvider],
})
export class UsersModule {}
