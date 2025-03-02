import { BadRequestException, Injectable, Logger } from '@nestjs/common';

import { CreateConversationDto } from '@/chats/dto/conversations/create-conversation.dto';
import { CreateMessageDto } from '@/chats/dto/messages/create-message.dto';
import { UpdateMessageDto } from '@/chats/dto/messages/update-message.dto';
import { PrismaService } from '@/providers/prisma.service';

@Injectable()
export class ChatsService {
	private readonly logger = new Logger(ChatsService.name);

	constructor(private readonly prismaService: PrismaService) {}

	async createConversation(dto: CreateConversationDto) {
		this.logger.debug('DTO received:', dto);

		this.logger.debug('DTO userAId:', dto.userAId);
		this.logger.debug('DTO userBId:', dto.userBId);

		if (!dto.userAId || !dto.userBId) {
			throw new BadRequestException('userAId and userBId are required');
		}

		const conversation = await this.prismaService.conversation.findFirst({
			where: {
				OR: [
					{ userAId: dto.userAId, userBId: dto.userBId },
					{ userAId: dto.userBId, userBId: dto.userAId },
				],
			},
		});

		if (conversation) {
			this.logger.log('Conversation already exists');
			return conversation;
		}

		const newConversation = await this.prismaService.conversation.create({
			data: {
				userA: { connect: { id: dto.userAId } },
				userB: { connect: { id: dto.userBId } },
			},
		});

		this.logger.log('New conversation created');
		return newConversation;
	}

	async getUserConversations(userId: number) {
		const conversations = this.prismaService.conversation.findMany({
			where: {
				OR: [{ userAId: userId }, { userBId: userId }],
			},
			include: { messages: true },
		});

		if (!conversations) {
			this.logger.log('No conversations found for user');

			return [];
		}

		this.logger.log('Conversations found for user');

		return conversations;
	}

	async sendMessage(dto: CreateMessageDto) {
		return this.prismaService.message.create({
			data: { ...dto },
		});
	}

	async getMessages(conversationId: number) {
		return this.prismaService.message.findMany({
			where: { conversationId },
			orderBy: { createdAt: 'asc' },
		});
	}

	async updateMessageStatus(id: number, dto: UpdateMessageDto) {
		return this.prismaService.message.update({
			where: { id: id },
			data: { ...dto },
		});
	}
}
