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
import { RevenuesService } from '@/revenues/revenues.service';

@Injectable()
export class PaymentsService {
	private readonly logger = new Logger(PaymentsService.name);

	constructor(
		private readonly prismaService: PrismaService,
		private readonly coursesService: CoursesService,
		private readonly payOSService: PayOSService,
		private readonly revenuesService: RevenuesService,
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
		try {
			this.logger.debug('Received webhook payload:', payload);

			if (!(await this.payOSService.verifySignature(payload))) {
				this.logger.error('Invalid signature');
				throw new Error('Invalid signature');
			}

			const orderCode = payload?.data?.orderCode;
			const description = payload?.data?.description;
			const amount = payload?.data?.amount;
			const isSuccess = payload.success;

			this.logger.debug(`Processing orderCode: ${orderCode}`);

			if (!orderCode || !isSuccess) {
				this.logger.warn('Ignoring non-successful webhook from PayOS.');
				return { message: 'Ignoring non-successful webhook' };
			}

			const payment = await this.prismaService.payment.findUnique({
				where: { id: orderCode },
			});

			if (!payment) {
				this.logger.error(`Payment with ID ${orderCode} not found`);
				throw new Error(`Payment with ID ${orderCode} not found`);
			}

			// Update payment status to avoid inconsistencies in case of errors in further processing
			await this.prismaService.payment.update({
				where: { id: orderCode },
				data: { status: 'paid' },
			});
			this.logger.debug(`Payment ${orderCode} marked as paid`);

			const user = await this.prismaService.user.findUnique({
				where: { id: payment.userId },
			});

			if (!user) {
				this.logger.error(`User with ID ${payment.userId} not found`);
				throw new Error(`User with ID ${payment.userId} not found`);
			}

			const isBecomeTeacher = description === 'BrainBox Become a Teacher';

			if (isBecomeTeacher) {
				await this.clerkClient.users.updateUser(user.clerkId, {
					publicMetadata: { role: 'teacher' },
				});

				await this.prismaService.revenue.create({
					data: {
						teacherId: user.id,
						totalRevenue: 0,
						totalWithdrawn: 0,
						serviceFee: 0,
						netRevenue: 0,
						availableForWithdraw: 0,
					},
				});

				this.logger.debug(`User ${user.id} has been updated to teacher role`);
				return 'Webhook processed successfully for teacher registration';
			}

			if (!payment.courseId) {
				this.logger.error(
					`Payment with ID ${orderCode} has no associated course`,
				);
				throw new Error(
					`Payment with ID ${orderCode} has no associated course`,
				);
			}

			const course = await this.coursesService.findOne(payment.courseId);
			let updateRevenuePromise = Promise.resolve();

			if (course && amount) {
				this.logger.debug(`Updating revenue for teacher ${course.teacherId}`);
				updateRevenuePromise = this.revenuesService
					.calculateRevenue(course.teacherId, amount)
					.then(() => {})
					.catch((error) => {
						this.logger.error(`Failed to update revenue: ${error.message}`);
					});
			}

			const createProgressPromise = this.coursesService.createProgress(
				payment.userId,
				payment.courseId,
			);

			await Promise.all([updateRevenuePromise, createProgressPromise]);

			this.logger.debug(`Webhook processing completed successfully.`);
			return 'Webhook processed successfully';
		} catch (error) {
			this.logger.error(`Error processing webhook: ${error.message}`);
			throw new Error(`Webhook processing failed: ${error.message}`);
		}
	}

	async findAll() {
		const payments = await this.prismaService.payment.findMany();

		this.logger.debug(`Found ${payments.length} payments`, payments);
		this.logger.log('Payments found:', payments.length);

		return payments;
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

	async findByCourseId(courseId: number) {
		const payments = await this.prismaService.payment.findMany({
			where: { courseId },
		});

		this.logger.debug(
			`Found ${payments.length} payments for course ${courseId}`,
			payments,
		);

		if (!payments) {
			this.logger.error('Payment not found');
			throw new NotFoundException('Payment not found');
		}

		return payments;
	}
}
