import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateWithdrawalDto {
	@ApiProperty()
	@IsNotEmpty()
	teacherId: number;

	@ApiProperty()
	@IsNotEmpty()
	amount: number;

	@ApiProperty()
	@IsNotEmpty()
	@IsEnum(['pending', 'approved', 'rejected', 'processing', 'completed'])
	status: WithdrawalStatus;

	@ApiProperty()
	@IsOptional()
	adminId?: number;

	@ApiProperty()
	@IsOptional()
	reason?: string;
}

export type WithdrawalStatus =
	| 'pending'
	| 'approved'
	| 'rejected'
	| 'processing'
	| 'completed';
