import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import payOSConfig from '@/configs/payos.config';
import { PayOSService } from '@/payments/payos.service';
import { ClerkClientProvider } from '@/providers/clerk.service';
import { PrismaService } from '@/providers/prisma.service';
import { UsersController } from '@/users/users.controller';
import { UsersService } from '@/users/users.service';

@Module({
	imports: [ConfigModule.forFeature(payOSConfig)],
	controllers: [UsersController],
	providers: [UsersService, PrismaService, ClerkClientProvider, PayOSService],
})
export class UsersModule {}
