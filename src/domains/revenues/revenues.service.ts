import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import { PrismaService } from '@/providers/prisma.service';
import { CreateRevenueDto } from '@/revenues/dto/create-revenue.dto';

@Injectable()
export class RevenuesService {
	private readonly logger = new Logger(RevenuesService.name);

	constructor(private readonly prismaService: PrismaService) {}

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

	async findAllByTeacher(teacherId: number) {
		const revenue = await this.prismaService.revenue.findMany({
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
}
