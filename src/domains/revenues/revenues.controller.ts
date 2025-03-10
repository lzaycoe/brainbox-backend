import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CreateRevenueDto } from '@/revenues/dto/create-revenue.dto';
import { RevenuesService } from '@/revenues/revenues.service';

@ApiTags('Revenues')
@Controller('revenues')
export class RevenuesController {
	constructor(private readonly revenuesService: RevenuesService) {}

	@Post()
	async create(@Body() createRevenueDto: CreateRevenueDto) {
		return await this.revenuesService.create(createRevenueDto);
	}

	@Get('teacher/:id')
	async findAllByTeacher(@Param('id') id: string) {
		return await this.revenuesService.findAllByTeacher(+id);
	}
}
