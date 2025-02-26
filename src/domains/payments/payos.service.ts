import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import * as crypto from 'crypto';

import payOSConfig from '@/configs/payos.config';
import { PrismaService } from '@/providers/prisma.service';

@Injectable()
export class PayOSService {
	private readonly logger = new Logger(PayOSService.name);

	constructor(
		private readonly prismaService: PrismaService,

		@Inject(payOSConfig.KEY)
		private readonly payOSConfiguration: ConfigType<typeof payOSConfig>,
	) {}

	async createPaymentLink(paymentId: number, price: number, items: any[]) {
		const expiredAt = Math.floor((Date.now() + 30 * 60 * 1000) / 1000); // 30 minutes expiry

		const payload = this.createPayload(paymentId, price, items, expiredAt);
		const headers = this.createHeaders();

		try {
			const response = await fetch(
				`${this.payOSConfiguration.baseURL}/v2/payment-requests`,
				{
					method: 'POST',
					headers,
					body: JSON.stringify(payload),
				},
			);

			if (!response.ok) {
				this.logger.error('Failed to create payment link');
				throw new Error('Failed to create payment link');
			}

			const responseData = await response.json();
			this.logger.debug('Payment API response:', responseData);

			return responseData?.data?.checkoutUrl || null;
		} catch (error) {
			this.logger.error(`Payment request error: ${error.message}`);
			throw new Error('Failed to create payment');
		}
	}

	async checkPaymentStatus(id: number) {
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

	async verifySignature(payload: any): Promise<boolean> {
		const signature = payload.signature;
		const payloadWithoutSignature = { ...payload.data };
		delete payloadWithoutSignature.signature;

		this.logger.debug('payloadWithoutSignature data:', payloadWithoutSignature);
		const calculatedSignature = this.createSignature(payloadWithoutSignature);
		this.logger.debug('Calculated signature:', calculatedSignature);
		this.logger.debug('Received signature:', signature);
		return signature === calculatedSignature;
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
			description: 'BrainBox - Course Purchase',
			cancelUrl: `${process.env.FRONTEND_URL}/purchase-failed`,
			returnUrl: `${process.env.FRONTEND_URL}/purchase-history`,
		};

		const signature = this.createSignature(payload);
		return { ...payload, signature, items, expiredAt };
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
}
