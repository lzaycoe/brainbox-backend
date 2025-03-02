import { PartialType } from '@nestjs/swagger';

import { CreateMessageDto } from '@/chats/dto/messages/create-message.dto';

export class UpdateMessageDto extends PartialType(CreateMessageDto) {}
