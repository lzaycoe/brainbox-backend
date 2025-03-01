import { Injectable } from '@nestjs/common';

import { CreateChatDto } from '@/chats/dto/create-chat.dto';
import { UpdateChatDto } from '@/chats/dto/update-chat.dto';

@Injectable()
export class ChatsService {
	create(createChatDto: CreateChatDto) {
		return { 'This action adds a new chat': createChatDto };
	}

	findAll() {
		return `This action returns all chats`;
	}

	findOne(id: number) {
		return `This action returns a #${id} chat`;
	}

	update(id: number, updateChatDto: UpdateChatDto) {
		return `This action updates a #${id} chat: ${updateChatDto}`;
	}

	remove(id: number) {
		return `This action removes a #${id} chat`;
	}
}
