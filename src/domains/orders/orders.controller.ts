import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CreateOrderDto } from '@/orders/dto/create-order.dto';
import { UpdateOrderDto } from '@/orders/dto/update-order.dto';
import { OrdersService } from '@/orders/orders.service';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
	constructor(private readonly ordersService: OrdersService) {}

	@Post()
	async create(@Body() createOrderDto: CreateOrderDto) {
		return this.ordersService.create(createOrderDto);
	}

	@Get()
	async findAll() {
		return this.ordersService.findAll();
	}

	@Get('user/:userId')
	async findByUserId(userId: string) {
		return this.ordersService.findByUserId(+userId);
	}

	@Get(':id')
	async findOne(id: string) {
		return this.ordersService.findOne(+id);
	}

	@Put(':id')
	async update(
		@Body() updateOrderDto: UpdateOrderDto,
		@Param('id') id: string,
	) {
		return this.ordersService.update(+id, updateOrderDto);
	}
}
