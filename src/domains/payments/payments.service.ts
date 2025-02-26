import {
	ConflictException,
	Inject,
	Injectable,
	Logger,
	NotFoundException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import * as crypto from 'crypto';

import payOSConfig from '@/configs/payos.config';
import { CoursesService } from '@/courses/courses.service';
import { CreatePaymentDto } from '@/payments/dto/create-payment.dto';
import { PrismaService } from '@/providers/prisma.service';

@Injectable()
export class PaymentsService {
	private readonly logger = new Logger(PaymentsService.name);

	constructor(
		private readonly prismaService: PrismaService,
		private readonly coursesService: CoursesService,
		@Inject(payOSConfig.KEY)
		private readonly payOSConfiguration: ConfigType<typeof payOSConfig>,
	) {}

	async create(dto: CreatePaymentDto) {
		const existingPayment = await this.prismaService.payment.findFirst({
			where: { userId: dto.userId, courseId: dto.courseId, status: 'paid' },
		});

		if (existingPayment) {
			this.logger.debug(
				`User ${dto.userId} has already paid for course ${dto.courseId}`,
			);
			throw new ConflictException('User has already paid for the course');
		}

		const course = await this.coursesService.findOne(dto.courseId);

		if (!course) {
			this.logger.error(`Course with ID ${dto.courseId} not found`);
			throw new NotFoundException(`Course with ID ${dto.courseId} not found`);
		}

		const items = [
			{
				name: course.title,
				quantity: 1,
				price: Number(course.salePrice),
			},
		];

		const newPayment = await this.prismaService.payment.create({
			data: dto,
		});

		const expiredAt = new Date(Date.now() + 30 * 60 * 1000);

		const headers = this.createHeaders();
		const payload = this.createPayload(
			newPayment.id,
			dto.price,
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
				const timeUntilExpiration = expiredAt.getTime() - Date.now();
				setTimeout(
					() => this.checkPaymentStatus(newPayment.id),
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
		paymentId: number,
		price: number,
		items: any[],
		expiredAt: number,
	) {
		const payload = {
			orderCode: paymentId,
			amount: price,
			description: 'BrainBox | Course Purchase',
			cancelUrl: `${process.env.FRONTEND_URL}/purchase-failed`,
			returnUrl: `${process.env.FRONTEND_URL}/purchase-history`,
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

		const { orderCode, description } = payload.data;

		this.logger.debug('orderCode:', orderCode);

		if (!orderCode || (orderCode == '123' && description == 'VQRIO123')) {
			this.logger.warn(
				'Received test webhook payload from PayOS, skipping processing.',
			);
			return { message: 'Test webhook received' };
		}

		const payment = await this.prismaService.payment.findUnique({
			where: { id: orderCode },
		});

		if (!payment) {
			throw new Error(`Payment with ID ${orderCode} not found`);
		}

		if (success) {
			await this.prismaService.payment.update({
				where: { id: orderCode },
				data: { status: 'paid' },
			});

			this.logger.debug(`Payment ${orderCode} marked as paid`);
		} else {
			await this.prismaService.payment.update({
				where: { id: orderCode },
				data: { status: 'canceled' },
			});

			this.logger.debug(`Payment ${orderCode} marked as failed`);
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

	private async checkPaymentStatus(id: number) {
		this.logger.log(`Checking payment status for order ${id}...`);

		const paymentInfo = await this.getPaymentInfo(id);
		const status = paymentInfo?.data?.status;

		if (status !== 'PAID') {
			await this.prismaService.payment.update({
				where: { id },
				data: { status: 'paid' },
			});
			this.logger.warn(`Payment ${id} failed. Order canceled.`);
		} else {
			this.logger.log(`Payment ${id} successful.`);
		}
	}

	async getPaymentInfo(id: number) {
		const headers = this.createHeaders();

		const paymentInfo = await fetch(
			`${this.payOSConfiguration.baseURL}/v2/payment-requests/${id}`,
			{
				method: 'GET',
				headers,
			},
		);
		return paymentInfo.json();
	}

	async findByUserId(userId: number) {
		const payments = await this.prismaService.payment.findMany({
			where: { userId },
		});

		if (!payments) {
			this.logger.error('Payment not found');
			throw new NotFoundException('Payment not found');
		}

		return payments;
	}
}
