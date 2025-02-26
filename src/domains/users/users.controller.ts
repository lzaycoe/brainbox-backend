import { Controller, Get, Param } from '@nestjs/common';

import { UsersService } from '@/users/users.service';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get('/normal-id/:clerkId')
	async getNormalId(@Param('clerkId') clerkId: string) {
		return this.usersService.getNormalId(clerkId);
	}
}
