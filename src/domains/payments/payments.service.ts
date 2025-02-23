import { Injectable, Logger } from '@nestjs/common';

import { CreatePaymentDto } from '@/payments/dto/create-payment.dto';
import { UpdatePaymentDto } from '@/payments/dto/update-payment.dto';

@Injectable()
export class PaymentsService {
	private readonly logger = new Logger(PaymentsService.name);

	create(createPaymentDto: CreatePaymentDto) {
		this.logger.log('This action adds a new payment', createPaymentDto);
		return 'This action adds a new payment';
	}

	findAll() {
		return `This action returns all payments`;
	}

	findOne(id: number) {
		return `This action returns a #${id} payment`;
	}

	update(id: number, updatePaymentDto: UpdatePaymentDto) {
		this.logger.log('This action adds a new payment', updatePaymentDto);

		return `This action updates a #${id} payment`;
	}

	remove(id: number) {
		return `This action removes a #${id} payment`;
	}
}
