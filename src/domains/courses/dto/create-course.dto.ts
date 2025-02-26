import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty } from 'class-validator';

export class CreateCourseDto {
	@ApiProperty()
	@IsNotEmpty()
	title: string;

	@ApiProperty()
	subtitle: string;

	@ApiProperty()
	description: string;

	@ApiProperty()
	@IsNotEmpty()
	originPrice: number;

	@ApiProperty()
	@IsNotEmpty()
	salePrice: number;

	@ApiProperty()
	thumbnail: string;

	@ApiProperty()
	@IsNotEmpty()
	tag: string;

	@ApiProperty()
	@IsIn(['pending', 'approved', 'rejected'])
	status: CourseStatus;

	@ApiProperty()
	@IsNotEmpty()
	teacherId: number;

	@ApiProperty()
	public: boolean;
}

export type CourseStatus = 'pending' | 'approved' | 'rejected';
