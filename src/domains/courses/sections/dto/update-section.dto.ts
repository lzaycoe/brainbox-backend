import { PartialType } from '@nestjs/swagger';

import { CreateSectionDto } from '@/courses/sections/dto/create-section.dto';

export class UpdateSectionDto extends PartialType(CreateSectionDto) {}
