import { Injectable } from '@nestjs/common';

import { CreateRevenueDto } from '@/revenues/dto/create-revenue.dto';
import { UpdateRevenueDto } from '@/revenues/dto/update-revenue.dto';

@Injectable()
export class RevenuesService {
	create(createRevenueDto: CreateRevenueDto) {
		return 'This action adds a new revenue' + createRevenueDto;
	}

	findAll() {
		return `This action returns all revenues`;
	}

	findOne(id: number) {
		return `This action returns a #${id} revenue`;
	}

	update(id: number, updateRevenueDto: UpdateRevenueDto) {
		return `This action updates a #${id} revenue` + updateRevenueDto;
	}

	remove(id: number) {
		return `This action removes a #${id} revenue`;
	}
}
