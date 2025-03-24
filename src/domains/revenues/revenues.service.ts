import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import { PrismaService } from '@/providers/prisma.service';
import { CreateRevenueDto } from '@/revenues/dto/create-revenue.dto';
import { UsersService } from '@/users/users.service';

@Injectable()
export class RevenuesService {
	private readonly logger = new Logger(RevenuesService.name);

	constructor(
		private readonly prismaService: PrismaService,
		private readonly usersService: UsersService,
	) {}

	async create(createRevenueDto: CreateRevenueDto) {
		const existingRevenue = await this.prismaService.revenue.findFirst({
			where: {
				teacherId: createRevenueDto.teacherId,
			},
		});

		if (existingRevenue) {
			this.logger.debug(
				`Revenue for teacher ${createRevenueDto.teacherId} already exists`,
			);

			return existingRevenue;
		}

		const newRevenue = await this.prismaService.revenue.create({
			data: createRevenueDto,
		});

		this.logger.debug(
			`Revenue for teacher ${createRevenueDto.teacherId} created successfully`,
		);

		this.logger.log('Revenue created successfully');

		return newRevenue;
	}

	async findByTeacherId(teacherId: number) {
		const revenue = await this.prismaService.revenue.findFirst({
			where: { teacherId },
		});

		if (!revenue) {
			this.logger.error(`Revenue for teacher ${teacherId} not found`);

			throw new NotFoundException(`Revenue for teacher ${teacherId} not found`);
		}

		return revenue;
	}

	async calculateRevenue(teacherId: number, price: number) {
		const revenue = await this.prismaService.revenue.findFirst({
			where: { teacherId },
		});

		if (!revenue) {
			const totalRevenue = price;
			const serviceFee = totalRevenue * 0.1;
			const netRevenue = totalRevenue - serviceFee;
			const totalWithdrawn = 0;
			const availableForWithdraw = netRevenue - totalWithdrawn;

			const newRevenue = await this.create({
				teacherId,
				totalRevenue,
				serviceFee,
				netRevenue,
				totalWithdrawn,
				availableForWithdraw,
			});

			this.logger.debug(
				`Revenue for teacher ${teacherId} created successfully`,
			);

			return newRevenue;
		}

		const totalRevenue = +revenue.totalRevenue + price;
		const totalWithdrawn = revenue.totalWithdrawn;
		const serviceFee = totalRevenue * 0.1;
		const netRevenue = totalRevenue - serviceFee;
		const availableForWithdraw = netRevenue - +totalWithdrawn;

		const updatedRevenue = await this.prismaService.revenue.update({
			where: { id: revenue.id },
			data: {
				totalRevenue,
				serviceFee,
				netRevenue,
				availableForWithdraw,
			},
		});

		this.logger.debug(`Revenue for teacher ${teacherId} updated successfully`);

		return updatedRevenue;
	}

	async updateTotalWithdrawn(teacherId: number, amount: number) {
		const revenue = await this.prismaService.revenue.findFirst({
			where: { teacherId },
		});

		if (!revenue) {
			this.logger.error(`Revenue for teacher ${teacherId} not found`);

			throw new NotFoundException(`Revenue for teacher ${teacherId} not found`);
		}

		const totalWithdrawn = +revenue.totalWithdrawn + amount;
		const availableForWithdraw = +revenue.availableForWithdraw - amount;

		const updatedRevenue = await this.prismaService.revenue.update({
			where: { id: revenue.id },
			data: {
				totalWithdrawn,
				availableForWithdraw,
			},
		});

		this.logger.debug(`Revenue for teacher ${teacherId} updated successfully`);

		return updatedRevenue;
	}

	async findSystemReport() {
		const [
			totalPayment,
			totalServiceFee,
			totalBecomeTeacherFee,
			users,
			totalCourses,
			totalCoursesCompleted,
		] = await Promise.all([
			this.prismaService.payment.findMany({ where: { status: 'paid' } }),
			this.prismaService.revenue.aggregate({
				_sum: { serviceFee: true },
				where: { teacherId: { not: 0 } },
			}),
			this.prismaService.payment.aggregate({
				_sum: { price: true },
				where: { courseId: null },
			}),
			this.usersService.findAll(),
			this.prismaService.course.findMany(),
			this.prismaService.progress.findMany({ where: { courseProgress: 100 } }),
		]);

		this.logger.debug('Total payment', totalPayment);

		const totalRevenue = totalPayment.reduce(
			(acc, payment) => acc + payment.price.toNumber(),
			0,
		);

		const systemRevenue =
			(totalServiceFee._sum.serviceFee?.toNumber() || 0) +
			(totalBecomeTeacherFee._sum.price?.toNumber() || 0);

		const totalServiceFeeValue = +(totalServiceFee._sum.serviceFee ?? 0);
		const totalBecomeTeacherFeeValue = +(totalBecomeTeacherFee._sum.price ?? 0);

		const totalLearners = users.length;
		const totalTeachers = users.filter(
			(user) => user?.clerkUser.publicMetadata.role === 'teacher',
		).length;

		const totalCoursesActive = totalCourses.filter(
			(course) => course.status === 'approved',
		).length;

		const totalCoursesSold = totalPayment.filter(
			(payment) => payment.courseId !== null,
		).length;

		const totalCoursesCompletedValue = totalCoursesCompleted.length;

		return {
			totalRevenue,
			systemRevenue,
			totalServiceFee: totalServiceFeeValue,
			totalBecomeTeacherFee: totalBecomeTeacherFeeValue,
			totalLearners,
			totalTeachers,
			totalCourses: totalCourses.length,
			totalCoursesActive,
			totalCoursesSold,
			totalCoursesCompleted: totalCoursesCompletedValue,
		};
	}
}
