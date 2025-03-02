import { PartialType } from '@nestjs/swagger';

import { CreateConversationDto } from '@/chats/dto/conversations/create-conversation.dto';

export class UpdateConversationDto extends PartialType(CreateConversationDto) {}
