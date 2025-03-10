import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateRevenueDto {
	@ApiProperty()
	@IsNotEmpty()
	teacherId: number;

	@ApiProperty()
	@IsNotEmpty()
	totalRevenue: number;

	@ApiProperty()
	@IsNotEmpty()
	totalWithdrawn: number;

	@ApiProperty()
	@IsNotEmpty()
	serviceFee: number;

	@ApiProperty()
	@IsNotEmpty()
	netRevenue: number;

	@ApiProperty()
	@IsNotEmpty()
	availableForWithdraw: number;
}
