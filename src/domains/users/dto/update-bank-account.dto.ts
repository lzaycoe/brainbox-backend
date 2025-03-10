import { PartialType } from '@nestjs/swagger';

import { CreateBankAccountDto } from '@/users/dto/create-bank-account.dto';

export class UpdateBankAccountDto extends PartialType(CreateBankAccountDto) {}
