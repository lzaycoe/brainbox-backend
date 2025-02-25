import { PartialType } from '@nestjs/swagger';

import { CreateOrderDto } from '@/orders/dto/create-order.dto';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {}
