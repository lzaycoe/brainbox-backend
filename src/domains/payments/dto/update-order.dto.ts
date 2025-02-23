import { PartialType } from '@nestjs/swagger';

import { CreateOrderDto } from '@/payments/dto/create-order.dto';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {}
