import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Post,
	Put,
	Request,
} from '@nestjs/common';

import { BecomeATeacherDto } from '@/users/dto/become-a-teacher.dto';
import { CreateBankAccountDto } from '@/users/dto/create-bank-account.dto';
import { UpdateBankAccountDto } from '@/users/dto/update-bank-account.dto';
import { UsersService } from '@/users/users.service';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get('/:valueId')
	async findOne(@Param('valueId') valueId: string) {
		return this.usersService.findOne(valueId);
	}

	@Get('/clerk/:valueId')
	async findOneClerk(@Param('valueId') valueId: string) {
		return this.usersService.findOneClerk(valueId);
	}

	@HttpCode(HttpStatus.OK)
	@Post('learner/callback')
	async learnerCreateCallback(@Request() req: any) {
		return this.usersService.syncDatabaseFromLearner(req);
	}

	@Post('become-a-teacher')
	async becomeATeacher(@Body() becomeATeacherDto: BecomeATeacherDto) {
		return this.usersService.becomeATeacher(becomeATeacherDto);
	}

	@Get('teachers/top/:top')
	async getTopTeachers(@Param('top') top: string) {
		return this.usersService.getTopTeachers(+top);
	}

	@Post('teachers/:teacherId/create-bank-account')
	async createBankAccount(
		@Param('teacherId') teacherId: string,
		@Body() dto: CreateBankAccountDto,
	) {
		return this.usersService.createBankAccount(+teacherId, dto);
	}

	@Put('teachers/:teacherId/update-bank-account')
	async updateBankAccount(
		@Param('teacherId') teacherId: string,
		@Body() dto: UpdateBankAccountDto,
	) {
		return this.usersService.updateBankAccount(+teacherId, dto);
	}
}
