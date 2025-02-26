import {
	ConflictException,
	Injectable,
	Logger,
	NotFoundException,
} from '@nestjs/common';

import { CoursesService } from '@/courses/courses.service';
import { CreatePaymentDto } from '@/payments/dto/create-payment.dto';
import { PayOSService } from '@/payments/payos.service';
import { PrismaService } from '@/providers/prisma.service';

@Injectable()
export class PaymentsService {
	private readonly logger = new Logger(PaymentsService.name);

	constructor(
		private readonly prismaService: PrismaService,
		private readonly coursesService: CoursesService,
		private readonly payOSService: PayOSService,
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
			{ name: course.title, quantity: 1, price: Number(course.salePrice) },
		];
		const newPayment = await this.prismaService.payment.create({ data: dto });

		const checkoutUrl = await this.payOSService.createPaymentLink(
			newPayment.id,
			dto.price,
			items,
		);

		if (!checkoutUrl) {
			this.logger.error('Checkout URL not found in the response');
			throw new Error('Checkout URL not found');
		}

		return checkoutUrl;
	}

	async processWebhook(payload: any) {
		this.logger.debug('Received webhook payload:', payload);
		const validSignature = await this.payOSService.verifySignature(payload);

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
