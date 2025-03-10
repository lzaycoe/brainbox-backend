import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CreateWithdrawalDto } from '@/withdrawals/dto/create-withdrawal.dto';
import { UpdateWithdrawalDto } from '@/withdrawals/dto/update-withdrawal.dto';
import { WithdrawalsService } from '@/withdrawals/withdrawals.service';

@ApiTags('Withdrawals')
@Controller('withdrawals')
export class WithdrawalsController {
	constructor(private readonly withdrawalsService: WithdrawalsService) {}

	@Post()
	async create(@Body() createWithdrawalDto: CreateWithdrawalDto) {
		return await this.withdrawalsService.create(createWithdrawalDto);
	}

	@Get()
	async findAll() {
		return await this.withdrawalsService.findAll();
	}

	@Get(':id')
	async findOne(@Param('id') id: string) {
		return await this.withdrawalsService.findOne(+id);
	}

	@Put(':id')
	async update(
		@Param('id') id: string,
		@Body() updateWithdrawalDto: UpdateWithdrawalDto,
	) {
		return await this.withdrawalsService.update(+id, updateWithdrawalDto);
	}
}
