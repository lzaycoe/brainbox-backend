import { PartialType } from '@nestjs/swagger';

import { CreateRevenueDto } from '@/revenues/dto/create-revenue.dto';

export class UpdateRevenueDto extends PartialType(CreateRevenueDto) {}
