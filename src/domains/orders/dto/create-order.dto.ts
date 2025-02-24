import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

import { CreatePaymentDto } from '@/payments/dto/create-payment.dto';

export class CreateOrderDto {
	@ApiProperty()
	@IsNotEmpty()
	userId: number;

	@ApiProperty({ type: [Number] })
	@IsArray()
	@IsNotEmpty()
	courseIds: number[];

	@ApiProperty()
	@IsNotEmpty()
	price: number;

	@ApiProperty({ enum: ['pending', 'paid', 'canceled'] })
	@IsEnum(['pending', 'paid', 'canceled'])
	@IsOptional()
	status?: OrderStatus;

	@ApiProperty()
	@IsOptional()
	payment?: CreatePaymentDto;
}

export type OrderStatus = 'pending' | 'paid' | 'canceled';
