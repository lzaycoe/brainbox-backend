import { PartialType } from '@nestjs/swagger';

import { CreateWithdrawalDto } from '@/withdrawals/dto/create-withdrawal.dto';

export class UpdateWithdrawalDto extends PartialType(CreateWithdrawalDto) {}
