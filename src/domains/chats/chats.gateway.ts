import { Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
	ConnectedSocket,
	MessageBody,
	OnGatewayConnection,
	OnGatewayDisconnect,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

import { ChatsService } from '@/chats/chats.service';
import { CreateConversationDto } from '@/chats/dto/conversations/create-conversation.dto';
import { CreateMessageDto } from '@/chats/dto/messages/create-message.dto';
import { UpdateMessageDto } from '@/chats/dto/messages/update-message.dto';

@ApiTags('Chats')
@WebSocketGateway(4002, { cors: { origin: '*' } })
export class ChatsGateway implements OnGatewayConnection, OnGatewayDisconnect {
	private readonly logger = new Logger(ChatsService.name);

	@WebSocketServer()
	server: Server;

	private activeUsers = new Map<number, string>();

	constructor(private readonly chatsService: ChatsService) {}

	async handleConnection(socket: Socket) {
		const userId = Number(socket.handshake.query.userId);
		this.logger.log(
			`⚡ [WebSocket] User connected: ${userId}, Socket ID: ${socket.id}`,
		);

		if (userId) {
			this.activeUsers.set(userId, socket.id);
			this.server.emit('activeUsers', Array.from(this.activeUsers.keys()));
		}
	}

	async handleDisconnect(socket: Socket) {
		const userId = Number(socket.handshake.query.userId);
		this.logger.log(
			`🔴 [WebSocket] User disconnected: ${userId}, Socket ID: ${socket.id}`,
		);

		if (userId) {
			this.activeUsers.delete(userId);
			this.server.emit('activeUsers', Array.from(this.activeUsers.keys()));
		}
	}

	@SubscribeMessage('createConversation')
	async handleCreateConversation(
		@MessageBody() dto: CreateConversationDto,
		@ConnectedSocket() client: Socket,
	) {
		console.log('🔥 Received WebSocket event: createConversation');
		this.logger.log('📩 Received createConversation event:', dto);
		try {
			const conversation = await this.chatsService.createConversation(dto);
			this.logger.log('✅ Created conversation:', conversation);
			client.emit('conversationCreated', conversation);
		} catch (error) {
			this.logger.error('❌ Error creating conversation:', error);
		}
	}

	@SubscribeMessage('sendMessage')
	async handleSendMessage(
		@MessageBody() { id, dto }: { id: string; dto: CreateMessageDto },
	) {
		const message = await this.chatsService.sendMessage(dto);
		const recipientSocketId = this.activeUsers.get(+id);
		if (recipientSocketId) {
			this.server.to(recipientSocketId).emit('newMessage', message);
		}
		const senderSocketId = this.activeUsers.get(dto.senderId);
		if (senderSocketId) {
			this.server.to(senderSocketId).emit('messageSent', message);
		}
	}

	@SubscribeMessage('getMessages')
	async handleGetMessages(
		@MessageBody() conversationId: number,
		@ConnectedSocket() client: Socket,
	) {
		const messages = await this.chatsService.getMessages(conversationId);
		client.emit('messages', messages);
	}

	@SubscribeMessage('updateMessageStatus')
	async handleUpdateMessageStatus(
		@MessageBody() { id, dto }: { id: string; dto: UpdateMessageDto },
	) {
		const updatedMessage = await this.chatsService.updateMessageStatus(
			+id,
			dto,
		);
		const senderSocketId = this.activeUsers.get(updatedMessage.senderId);
		if (senderSocketId) {
			this.server
				.to(senderSocketId)
				.emit('messageStatusUpdated', updatedMessage);
		}
	}
}
