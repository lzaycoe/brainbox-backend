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

@ApiTags('Chats')
@WebSocketGateway({ cors: { origin: '*' } })
export class ChatsGateway implements OnGatewayConnection, OnGatewayDisconnect {
	private readonly logger = new Logger(ChatsService.name);

	@WebSocketServer()
	server: Server;

	private readonly activeUsers = new Map<number, string>();

	constructor(private readonly chatsService: ChatsService) {}

	async handleConnection(socket: Socket) {
		const userId = Number(socket.handshake.query.userId);
		this.logger.log(
			`⚡ [WebSocket] User connected: ${userId}, Socket ID: ${socket.id}`,
		);

		if (userId) {
			this.activeUsers.set(userId, socket.id);
			this.server.emit(
				`Connected for User ${userId}`,
				Array.from(this.activeUsers.keys()),
			);
		}
	}

	async handleDisconnect(socket: Socket) {
		const userId = Number(socket.handshake.query.userId);
		this.logger.log(
			`🔴 [WebSocket] User disconnected: ${userId}, Socket ID: ${socket.id}`,
		);

		if (userId) {
			this.activeUsers.delete(userId);
			this.server.emit(
				`Disconnect for User ${userId}`,
				Array.from(this.activeUsers.keys()),
			);
		}
	}

	@SubscribeMessage('createConversation')
	async handleCreateConversation(
		@MessageBody() payload: string,
		@ConnectedSocket() client: Socket,
	) {
		const parsedDto = JSON.parse(payload);
		try {
			const conversation =
				await this.chatsService.createConversation(parsedDto);
			this.logger.log('✅ Created conversation:', conversation);
			client.emit('Conversation Created', conversation);
		} catch (error) {
			this.logger.error('❌ Error creating conversation:', error);
		}
	}

	@SubscribeMessage('getConversations')
	async handleGetConversations(
		@MessageBody() payload: string,
		@ConnectedSocket() client: Socket,
	) {
		try {
			const parsedPayload = JSON.parse(payload);
			const { userId } = parsedPayload;

			if (!userId) {
				client.emit('Error', { message: 'User ID is required' });
				return;
			}

			const conversations =
				await this.chatsService.getUserConversations(userId);

			if (!conversations || conversations.length === 0) {
				this.logger.log(`No conversations found for user ${userId}`);
				client.emit('Get Conversations', []);
				return;
			}

			this.logger.log(`✅ Conversations found for user ${userId}`);
			client.emit('Get Conversations', conversations);
		} catch (error) {
			this.logger.error('❌ Error fetching conversations:', error);
			client.emit('Error', { message: 'Failed to fetch conversations' });
		}
	}

	@SubscribeMessage('sendMessage')
	async handleSendMessage(@MessageBody() payload: string) {
		const parsedPayload = JSON.parse(payload);
		const { id, dto } = parsedPayload;
		const message = await this.chatsService.sendMessage(dto);
		const recipientSocketId = this.activeUsers.get(+id);
		if (recipientSocketId) {
			this.server.to(recipientSocketId).emit('New Message', message);
		}
		const senderSocketId = this.activeUsers.get(+dto.senderId);
		if (senderSocketId) {
			this.server.to(senderSocketId).emit('Message Sent', message);
		}
	}

	@SubscribeMessage('getMessages')
	async handleGetMessages(
		@MessageBody() payload: string,
		@ConnectedSocket() client: Socket,
	) {
		const parsedPayload = JSON.parse(payload);
		const { id } = parsedPayload;
		const messages = await this.chatsService.getMessages(+id);
		client.emit('Messages', messages);
	}

	@SubscribeMessage('updateMessageStatus')
	async handleUpdateMessageStatus(@MessageBody() payload: string) {
		const parsedPayload = JSON.parse(payload);
		const { id, dto } = parsedPayload;
		const updatedMessage = await this.chatsService.updateMessageStatus(
			+id,
			dto,
		);
		const senderSocketId = this.activeUsers.get(updatedMessage.senderId);
		if (senderSocketId) {
			this.server
				.to(senderSocketId)
				.emit('Message Status Updated', updatedMessage);
		}
	}
}
