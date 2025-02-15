import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateSessionDto {
	@ApiProperty()
	@IsNotEmpty()
	courseId: number;

	@ApiProperty()
	@IsNotEmpty()
	title: string;
}
