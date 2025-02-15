import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateSessionDto {
	@ApiProperty()
	@IsNotEmpty()
	title: string;
}
