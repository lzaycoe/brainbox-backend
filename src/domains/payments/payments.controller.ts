import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CreatePaymentDto } from '@/payments/dto/create-payment.dto';
import { PaymentsService } from '@/payments/payments.service';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
	constructor(private readonly paymentsService: PaymentsService) {}

	@Post()
	async create(@Body() createPaymentDto: CreatePaymentDto) {
		return this.paymentsService.create(createPaymentDto);
	}

	@Post('webhook')
	async handleWebhook(@Body() payload: any) {
		return await this.paymentsService.processWebhook(payload);
	}

	@Get('user/:userId')
	async findByUserId(@Param('userId') userId: string) {
		return this.paymentsService.findByUserId(+userId);
	}
}
