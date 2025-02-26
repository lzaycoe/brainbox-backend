import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class BecomeATeacherDto {
	@ApiProperty()
	@IsNotEmpty()
	userId: number;

	@ApiProperty()
	@IsNotEmpty()
	price: number;
}
