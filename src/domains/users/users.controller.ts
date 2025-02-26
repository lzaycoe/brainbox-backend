import {
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Post,
	Request,
} from '@nestjs/common';

import { UsersService } from '@/users/users.service';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get('/normal-id/:clerkId')
	async getNormalId(@Param('clerkId') clerkId: string) {
		return this.usersService.getNormalId(clerkId);
	}

	@HttpCode(HttpStatus.OK)
	@Post('learner/callback')
	async learnerCreateCallback(@Request() req: any) {
		return this.usersService.syncDatabaseFromLearner(req);
	}
}
