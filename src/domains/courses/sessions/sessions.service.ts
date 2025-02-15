import { Injectable, Logger } from '@nestjs/common';

import { CreateSessionDto } from '@/courses/sessions/dto/create-session.dto';
import { UpdateSessionDto } from '@/courses/sessions/dto/update-session.dto';
import { PrismaService } from '@/providers/prisma.service';

@Injectable()
export class SessionsService {
	private readonly logger = new Logger(SessionsService.name);

	constructor(private readonly prismaService: PrismaService) {}

	create(createSessionDto: CreateSessionDto) {
		this.logger.log('This action adds a new session', createSessionDto);
		return 'This action adds a new session';
	}

	findAll() {
		return `This action returns all sessions`;
	}

	findOne(id: number) {
		return `This action returns a #${id} session`;
	}

	update(id: number, updateSessionDto: UpdateSessionDto) {
		this.logger.log('This action updates a session', updateSessionDto);
		return `This action updates a #${id} session`;
	}

	remove(id: number) {
		return `This action removes a #${id} session`;
	}
}
