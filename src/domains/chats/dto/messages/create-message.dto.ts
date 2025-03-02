import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMessageDto {
	@ApiProperty()
	@IsNotEmpty()
	conversationId: number;

	@ApiProperty()
	@IsNotEmpty()
	senderId: number;

	@ApiProperty()
	@IsString()
	@IsOptional()
	content?: string;

	@ApiProperty()
	@IsArray()
	@IsString({ each: true })
	@IsOptional()
	attachments?: string[];

	@ApiProperty()
	@IsOptional()
	messageType?: MessageType;

	@ApiProperty()
	@IsOptional()
	status?: MessageStatus;
}

export type MessageType = 'text' | 'image' | 'file';

export type MessageStatus = 'sent' | 'received' | 'seen';
