import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import { CoursesService } from '@/courses/courses.service';
import { CreateOrderDto } from '@/orders/dto/create-order.dto';
import { UpdateOrderDto } from '@/orders/dto/update-order.dto';
import { PrismaService } from '@/providers/prisma.service';

@Injectable()
export class OrdersService {
	private readonly logger = new Logger(OrdersService.name);

	constructor(
		private prismaService: PrismaService,
		private readonly coursesService: CoursesService,
	) {}

	async create(dto: CreateOrderDto) {
		const course = await this.coursesService.findOne(dto.courseId);
		if (!course) {
			this.logger.log(`Course with id '${dto.courseId}' not found`);
			throw new NotFoundException('Course not found');
		}

		try {
			const newOrder = await this.prismaService.order.create({
				data: {
					...dto,
					status: 'pending',
					payment: dto.payment ? { create: dto.payment } : undefined,
				},
			});

			this.logger.log(`Order with id '${newOrder.id}' created`);

			return newOrder;
		} catch (error: any) {
			this.logger.error(error);

			throw error;
		}
	}

	async findAll() {
		const orders = await this.prismaService.order.findMany();

		this.logger.log(`Found ${orders.length} orders`);

		return orders;
	}

	async findByUserId(userId: number) {
		const orders = await this.prismaService.order.findMany({
			where: { userId },
		});

		this.logger.log(
			`Found ${orders.length} orders for user with id '${userId}'`,
		);

		return orders;
	}

	async findOne(id: number) {
		const order = await this.prismaService.order.findUnique({
			where: { id },
		});

		if (!order) {
			this.logger.log(`Order with id '${id}' not found`);

			throw new NotFoundException(`Order with id '${id}' not found`);
		}

		this.logger.log(`Order with id '${id}' found`);

		return order;
	}

	async update(id: number, dto: UpdateOrderDto) {
		await this.findOne(id);

		try {
			const order = await this.prismaService.order.update({
				where: { id },
				data: {
					...dto,
					payment: dto.payment ? { update: dto.payment } : undefined,
				},
			});

			this.logger.log(`Order with id '${id}' updated`);

			return order;
		} catch (error: any) {
			this.logger.error(error);

			throw error;
		}
	}
}
