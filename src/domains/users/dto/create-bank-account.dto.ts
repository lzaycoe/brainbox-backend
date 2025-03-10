import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateBankAccountDto {
	@ApiProperty()
	@IsNotEmpty()
	bank_name: string;

	@ApiProperty()
	@IsNotEmpty()
	account_number: string;

	@ApiProperty()
	@IsNotEmpty()
	account_holder: string;
}
