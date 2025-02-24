import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import * as crypto from 'crypto';

import { OrdersService } from '@/orders/orders.service';
import PayOSConfig from '@/payments/config/payos.config';
import { CreatePaymentDto } from '@/payments/dto/create-payment.dto';
import { PrismaService } from '@/providers/prisma.service';

@Injectable()
export class PaymentsService {
	private readonly logger = new Logger(PaymentsService.name);
	private readonly baseUrl = PayOSConfig.base_url;
	private readonly clientId = PayOSConfig.client_id;
	private readonly apiKey = PayOSConfig.api_key;
	private readonly checksumKey = PayOSConfig.checksum_key;

	constructor(
		private prismaService: PrismaService,
		private readonly ordersService: OrdersService,
	) {}

	async create(dto: CreatePaymentDto) {
		const order = await this.prismaService.order.findUnique({
			where: { id: dto.orderId },
			include: { user: true },
		});

		if (!order) {
			this.logger.error(`Order ${dto.orderId} not found`);
			throw new NotFoundException('Order not found');
		}

		if (!this.clientId || !this.apiKey) {
			this.logger.error('Client ID or API Key is not defined');
			throw new NotFoundException('Client ID or API Key is not defined');
		}

		const courses = await this.prismaService.course.findMany({
			where: { id: { in: order.courseIds } },
			select: { id: true, title: true, salePrice: true },
		});

		if (!courses.length) {
			this.logger.error(`No courses found for order ${dto.orderId}`);
			throw new NotFoundException('Courses not found');
		}

		const items = courses.map((course) => ({
			name: course.title,
			quantity: 1,
			price: Number(course.salePrice),
		}));

		const payload = this.createPayload(dto.orderId, Number(order.price), items);
		const checksum = this.generateChecksum(payload);
		this.logger.debug(`Checksum generated: ${checksum}`);

		const headers = this.createHeaders();

		try {
			const response = await fetch(`${this.baseUrl}/v2/payment-requests`, {
				method: 'POST',
				headers,
				body: JSON.stringify({ ...payload, checksum }),
			});

			if (!response.ok) {
				this.logger.error('Failed to create payment');
				throw new Error('Failed to create payment');
			}

			const responseData = await response.json();
			this.logger.debug('Payment API response:', responseData);

			if (responseData?.data?.checkoutUrl) {
				await this.prismaService.payment.create({
					data: { orderId: dto.orderId },
				});
				return responseData.data.checkoutUrl;
			} else {
				this.logger.error('Checkout URL not found in the response');
				throw new Error('Checkout URL not found');
			}
		} catch (error) {
			this.logger.error(`Payment request error: ${error.message}`);
			throw new Error('Failed to create payment');
		}
	}

	private createPayload(orderId: number, price: number, items: any[]) {
		const payload = {
			orderCode: orderId,
			amount: price,
			description: 'Payment for courses',
			cancelUrl: `${process.env.FRONTEND_URL}/payment-failed`,
			returnUrl: `${process.env.FRONTEND_URL}/payment-success`,
		};

		const signature = this.createSignature(payload);
		return {
			...payload,
			items,
			expiredAt: Math.floor(Date.now() / 1000 + 3600),
			signature,
		};
	}

	private createSignature(payload: Record<string, any>): string {
		const dataString = Object.entries(payload)
			.sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
			.map(([key, value]) => `${key}=${value}`)
			.join('&');

		if (!this.checksumKey) {
			this.logger.error('Checksum key is not defined');
			throw new NotFoundException('Checksum key is not defined');
		}

		return crypto
			.createHmac('sha256', this.checksumKey as crypto.BinaryLike)
			.update(dataString)
			.digest('hex');
	}

	private createHeaders(): Record<string, string> {
		if (!this.clientId || !this.apiKey) {
			this.logger.error('Client ID or API Key is not defined');
			throw new NotFoundException('Client ID or API Key is not defined');
		}
		return {
			'Content-Type': 'application/json',
			'X-Client-Id': this.clientId,
			'X-Api-Key': this.apiKey,
		};
	}

	private generateChecksum(payload: Record<string, any>): string {
		const dataString = Object.values(payload).join('|');
		if (!this.checksumKey) {
			this.logger.error('Checksum key is not defined');
			throw new NotFoundException('Checksum key is not defined');
		}
		return crypto
			.createHmac('sha256', this.checksumKey as crypto.BinaryLike)
			.update(dataString)
			.digest('hex');
	}

	async processWebhook(payload: any) {
		const { orderCode, status, checksum } = payload;

		const validChecksum = this.verifyChecksum(payload, checksum);
		if (!validChecksum) {
			this.logger.error('Invalid checksum');
			return { success: false, message: 'Invalid checksum' };
		}

		try {
			await this.ordersService.update(orderCode, { status });

			this.logger.log(`Updated order ${orderCode} status to ${status}`);
			return { success: true };
		} catch (error) {
			this.logger.error(`Failed to update order: ${error.message}`);
			return { success: false, message: 'Failed to update order' };
		}
	}

	private verifyChecksum(payload: any, receivedChecksum: string): boolean {
		const dataString = Object.entries(payload)
			.filter(([key]) => key !== 'checksum')
			.map(([key, value]) => `${key}=${value}`)
			.join('|');

		const expectedChecksum = crypto
			.createHmac('sha256', this.checksumKey as crypto.BinaryLike)
			.update(dataString)
			.digest('hex');

		return expectedChecksum === receivedChecksum;
	}
}
