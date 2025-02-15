import { PartialType } from '@nestjs/swagger';

import { CreateSessionDto } from '@/courses/sessions/dto/create-session.dto';

export class UpdateSessionDto extends PartialType(CreateSessionDto) {}
