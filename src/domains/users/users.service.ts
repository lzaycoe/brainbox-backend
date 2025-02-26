import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import { PrismaService } from '@/providers/prisma.service';

@Injectable()
export class UsersService {
	private readonly logger = new Logger(UsersService.name);

	constructor(private readonly prismaService: PrismaService) {}

	async getNormalId(clerkId: string): Promise<any> {
		try {
			const user = await this.prismaService.user.findUnique({
				where: { clerkId: clerkId },
			});

			if (!user) {
				throw new NotFoundException('User not found');
			}

			this.logger.log('User found with clerkId: ' + clerkId);
			this.logger.debug(user);

			return { id: user.id };
		} catch (error: any) {
			this.logger.error(error);

			throw error;
		}
	}
}
