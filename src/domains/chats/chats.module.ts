import { Module } from '@nestjs/common';

import { ChatsGateway } from '@/chats/chats.gateway';
import { ChatsService } from '@/chats/chats.service';

@Module({
	providers: [ChatsGateway, ChatsService],
})
export class ChatsModule {}
