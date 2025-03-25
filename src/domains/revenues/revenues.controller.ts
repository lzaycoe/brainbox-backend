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

	@Get('teacher/:teacherId')
	async findByTeacherId(@Param('teacherId') teacherId: string) {
		return await this.revenuesService.findByTeacherId(+teacherId);
	}

	@Get('system-report')
	async findSystemReport() {
		return await this.revenuesService.findSystemReport();
	}

	@Get('teacher-report/:teacherId')
	async findTeacherReport(@Param('teacherId') teacherId: string) {
		return await this.revenuesService.findTeacherReport(+teacherId);
	}
}
