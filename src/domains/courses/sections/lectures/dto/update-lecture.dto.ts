import { PartialType } from '@nestjs/swagger';

import { CreateLectureDto } from '@/courses/sections/lectures/dto/create-lecture.dto';

export class UpdateLectureDto extends PartialType(CreateLectureDto) {}
