import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePaymentDto {
	@ApiProperty()
	@IsNotEmpty()
	userId: number;

	@ApiProperty()
	@IsOptional()
	courseId: number;

	@ApiProperty()
	@IsNotEmpty()
	price: number;

	@ApiProperty({ enum: ['pending', 'paid', 'canceled'] })
	@IsEnum(['pending', 'paid', 'canceled'])
	@IsOptional()
	status?: PaymentStatus;
}

export type PaymentStatus = 'pending' | 'paid' | 'canceled';
