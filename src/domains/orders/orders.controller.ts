import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CreateOrderDto } from '@/orders/dto/create-order.dto';
import { OrdersService } from '@/orders/orders.service';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
	constructor(private readonly ordersService: OrdersService) {}

	@Post()
	async create(@Body() createOrderDto: CreateOrderDto) {
		return this.ordersService.create(createOrderDto);
	}

	@Get('user/:userId')
	async findByUserId(userId: string) {
		return this.ordersService.findByUserId(+userId);
	}
}
