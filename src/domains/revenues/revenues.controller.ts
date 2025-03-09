import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
} from '@nestjs/common';

import { CreateRevenueDto } from '@/revenues/dto/create-revenue.dto';
import { UpdateRevenueDto } from '@/revenues/dto/update-revenue.dto';
import { RevenuesService } from '@/revenues/revenues.service';

@Controller('revenues')
export class RevenuesController {
	constructor(private readonly revenuesService: RevenuesService) {}

	@Post()
	create(@Body() createRevenueDto: CreateRevenueDto) {
		return this.revenuesService.create(createRevenueDto);
	}

	@Get()
	findAll() {
		return this.revenuesService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.revenuesService.findOne(+id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateRevenueDto: UpdateRevenueDto) {
		return this.revenuesService.update(+id, updateRevenueDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.revenuesService.remove(+id);
	}
}
