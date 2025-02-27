import { ClerkClient } from '@clerk/backend';
import {
	ConflictException,
	Inject,
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
		@Inject('ClerkClient')
		private readonly clerkClient: ClerkClient,
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

		if (!(await this.payOSService.verifySignature(payload))) {
			this.logger.error('Invalid signature');
			throw new Error('Invalid signature');
		}

		const orderCode = payload?.data?.orderCode;
		const description = payload?.data?.description;

		this.logger.debug(`Processing orderCode: ${orderCode}`);

		if (!orderCode || (orderCode == '123' && description == 'VQRIO123')) {
			this.logger.warn(
				'Received test webhook payload from PayOS, skipping processing.',
			);
			return { message: 'Test webhook received' };
		}

		const payment = await this.prismaService.payment.findUnique({
			where: { id: orderCode },
			select: { id: true, userId: true },
		});
		if (!payment) {
			this.logger.error(`Payment with ID ${orderCode} not found`);
			throw new Error(`Payment with ID ${orderCode} not found`);
		}

		const user = await this.prismaService.user.findUnique({
			where: { id: payment.userId },
		});

		if (!user) {
			this.logger.error(`User with ID ${payment.userId} not found`);
			throw new Error(`User with ID ${payment.userId} not found`);
		}

		const isBecomeTeacher = description === 'BrainBox Become a Teacher';
		const updateRolePromise =
			isBecomeTeacher && payload.success
				? this.clerkClient.users
						.updateUser(user.clerkId, {
							publicMetadata: { role: 'teacher' },
						})
						.then(() => {
							this.logger.debug(
								`User ${user.id} has been updated to teacher role`,
							);
						})
				: Promise.resolve();

		const status = payload.success ? 'paid' : 'canceled';
		const updatePaymentPromise = this.prismaService.payment.update({
			where: { id: orderCode },
			data: { status },
		});

		await Promise.all([updateRolePromise, updatePaymentPromise]);

		this.logger.debug(`Payment ${orderCode} marked as ${status}`);
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
