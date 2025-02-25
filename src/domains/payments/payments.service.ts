import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import * as crypto from 'crypto';

import payOSConfig from '@/configs/payos.config';
import { CoursesService } from '@/courses/courses.service';
import { OrdersService } from '@/orders/orders.service';
import { CreatePaymentDto } from '@/payments/dto/create-payment.dto';
import { PrismaService } from '@/providers/prisma.service';

@Injectable()
export class PaymentsService {
	private readonly logger = new Logger(PaymentsService.name);

	constructor(
		private readonly prismaService: PrismaService,
		private readonly ordersService: OrdersService,
		private readonly coursesService: CoursesService,
		@Inject(payOSConfig.KEY)
		private readonly payOSConfiguration: ConfigType<typeof payOSConfig>,
	) {}

	async create(dto: CreatePaymentDto) {
		const order = await this.ordersService.findOne(dto.orderId);

		if (!order) {
			this.logger.error(`Order ${dto.orderId} not found`);
			throw new NotFoundException('Order not found');
		}

		if (order.courseId === null) {
			this.logger.error(`Order ${dto.orderId} has no courseId`);
			throw new NotFoundException('Order has no courseId');
		}
		const course = await this.coursesService.findOne(order.courseId);

		const items = [
			{
				name: course.title,
				quantity: 1,
				price: Number(course.salePrice),
			},
		];

		const expiredAt = new Date(Date.now() + 30 * 60 * 1000);

		const headers = this.createHeaders();
		const payload = this.createPayload(
			dto.orderId,
			Number(order.price),
			items,
			Math.floor(expiredAt.getTime() / 1000),
		);

		try {
			const response = await fetch(
				`${this.payOSConfiguration.baseURL}/v2/payment-requests`,
				{
					method: 'POST',
					headers,
					body: JSON.stringify({ ...payload }),
				},
			);

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

				const timeUntilExpiration = expiredAt.getTime() - Date.now();
				setTimeout(
					() => this.checkPaymentStatus(dto.orderId),
					timeUntilExpiration,
				);

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

	private createHeaders(): Record<string, string> {
		if (!this.payOSConfiguration.clientId || !this.payOSConfiguration.apiKey) {
			this.logger.error('Client ID or API Key is not defined');
			throw new NotFoundException('Client ID or API Key is not defined');
		}
		return {
			'Content-Type': 'application/json',
			'X-Client-Id': this.payOSConfiguration.clientId,
			'X-Api-Key': this.payOSConfiguration.apiKey,
		};
	}

	private createPayload(
		orderId: number,
		price: number,
		items: any[],
		expiredAt: number,
	) {
		const payload = {
			orderCode: orderId,
			amount: price,
			description: 'BrainBox | Course Purchase',
			cancelUrl: `${process.env.FRONTEND_URL}/payment-failed`,
			returnUrl: `${process.env.FRONTEND_URL}/payment-history`,
		};

		const signature = this.createSignature(payload);
		return {
			...payload,
			items,
			expiredAt,
			signature,
		};
	}

	private createSignature(payload: Record<string, any>): string {
		const dataString = Object.entries(payload)
			.sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
			.map(([key, value]) => `${key}=${value}`)
			.join('&');

		if (!this.payOSConfiguration.checksumKey) {
			this.logger.error('Checksum key is not defined');
			throw new NotFoundException('Checksum key is not defined');
		}

		return crypto
			.createHmac(
				'sha256',
				this.payOSConfiguration.checksumKey as crypto.BinaryLike,
			)
			.update(dataString)
			.digest('hex');
	}

	async processWebhook(payload: any) {
		this.logger.debug('Received webhook payload:', payload);
		const validSignature = this.verifySignature(payload);

		if (!validSignature) {
			this.logger.error('Invalid signature');

			throw new Error('Invalid signature');
		}

		const { success } = payload;

		const { orderCode } = payload.data;

		this.logger.debug('orderCode:', orderCode);

		if (!orderCode) {
			this.logger.warn(
				'Received test webhook payload from PayOS, skipping processing.',
			);
			return { message: 'Test webhook received' };
		}

		const order = await this.ordersService.findOne(orderCode);
		if (!order) {
			throw new Error(`Order with ID ${orderCode} not found`);
		}

		if (success) {
			await this.prismaService.payment.update({
				where: { orderId: orderCode },
				data: { status: 'completed' },
			});

			await this.ordersService.update(orderCode, { status: 'paid' });
			this.logger.debug(`Order ${orderCode} marked as paid`);
		} else {
			await this.prismaService.payment.update({
				where: { orderId: orderCode },
				data: { status: 'failed' },
			});

			await this.ordersService.update(orderCode, { status: 'canceled' });
			this.logger.debug(`Order ${orderCode} marked as failed`);
		}

		return 'Webhook processed successfully';
	}

	private verifySignature(payload: any): boolean {
		const signature = payload.signature;
		const payloadWithoutSignature = { ...payload.data };
		delete payloadWithoutSignature.signature;

		this.logger.debug('payloadWithoutSignature data:', payloadWithoutSignature);
		const calculatedSignature = this.createSignature(payloadWithoutSignature);
		this.logger.debug('Calculated signature:', calculatedSignature);
		this.logger.debug('Received signature:', signature);
		return signature === calculatedSignature;
	}

	private async checkPaymentStatus(orderId: number) {
		this.logger.log(`Checking payment status for order ${orderId}...`);

		const paymentInfo = await this.getPaymentInfo(orderId);
		const status = paymentInfo?.data?.status;

		if (status !== 'PAID') {
			await this.prismaService.payment.update({
				where: { orderId },
				data: { status: 'failed' },
			});
			await this.ordersService.update(orderId, { status: 'canceled' });

			this.logger.warn(`Payment ${orderId} failed. Order canceled.`);
		} else {
			this.logger.log(`Payment ${orderId} successful.`);
		}
	}

	async getPaymentInfo(orderId: number) {
		const headers = this.createHeaders();

		const paymentInfo = await fetch(
			`${this.payOSConfiguration.baseURL}/v2/payment-requests/${orderId}`,
			{
				method: 'GET',
				headers,
			},
		);
		return paymentInfo.json();
	}
}
