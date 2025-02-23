import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

import { CreatePaymentDto } from '@/payments/dto/create-payment.dto';

export class CreateOrderDto {
	@ApiProperty()
	@IsNotEmpty()
	userId: number;

	@ApiProperty()
	@IsNotEmpty()
	courseId: number;

	@ApiProperty()
	@IsNotEmpty()
	amount: number;

	@ApiProperty()
	status?: OrderStatus;

	@ApiProperty()
	payment?: CreatePaymentDto;
}

export type OrderStatus = 'pending' | 'paid' | 'canceled';
