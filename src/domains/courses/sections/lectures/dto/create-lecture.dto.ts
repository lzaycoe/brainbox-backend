import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty } from 'class-validator';

export class CreateLectureDto {
	@ApiProperty()
	@IsNotEmpty()
	title: string;

	@ApiProperty()
	description: string;

	@ApiProperty()
	content: string;

	@ApiProperty()
	@IsIn(['video', 'file', 'link', 'text'])
	type: LectureType;

	@ApiProperty()
	note: string;

	@ApiProperty()
	attachments: string[];

	@ApiProperty()
	canPreview: boolean;
}

export type LectureType = 'video' | 'file' | 'link' | 'text';
