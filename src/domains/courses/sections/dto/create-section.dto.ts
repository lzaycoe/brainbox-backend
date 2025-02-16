import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateSectionDto {
	@ApiProperty()
	@IsNotEmpty()
	title: string;
}
