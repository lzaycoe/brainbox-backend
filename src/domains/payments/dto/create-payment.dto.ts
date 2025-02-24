import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePaymentDto {
	@ApiProperty()
	@IsNotEmpty()
	orderId: number;

	@ApiProperty()
	@IsOptional()
	status?: PaymentStatus;
}

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'canceled';
