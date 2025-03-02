import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateConversationDto {
	@ApiProperty()
	@IsNotEmpty()
	userAId: number;

	@ApiProperty()
	@IsNotEmpty()
	userBId: number;
}
