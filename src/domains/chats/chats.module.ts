import { Module } from '@nestjs/common';

import { ChatsGateway } from '@/chats/chats.gateway';
import { ChatsService } from '@/chats/chats.service';
import { PrismaService } from '@/providers/prisma.service';

@Module({
	providers: [ChatsGateway, ChatsService, PrismaService],
	exports: [ChatsService],
})
export class ChatsModule {}
