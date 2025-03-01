import { PartialType } from '@nestjs/swagger';

import { CreateChatDto } from '@/chats/dto/create-chat.dto';

export class UpdateChatDto extends PartialType(CreateChatDto) {
	id: number;
}
