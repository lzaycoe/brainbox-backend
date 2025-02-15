import { PartialType } from '@nestjs/swagger';

import { CreateCourseDto } from '@/courses/dto/create-course.dto';

export class UpdateCourseDto extends PartialType(CreateCourseDto) {}
