import { ClerkClient } from '@clerk/backend';
import {
	BadRequestException,
	ConflictException,
	Inject,
	Injectable,
	Logger,
	NotFoundException,
	RawBodyRequest,
	Req,
} from '@nestjs/common';
import { Request } from 'express';
import { Webhook } from 'svix';

import { PayOSService } from '@/payments/payos.service';
import { PrismaService } from '@/providers/prisma.service';
import { BecomeATeacherDto } from '@/users/dto/become-a-teacher.dto';
import { CreateBankAccountDto } from '@/users/dto/create-bank-account.dto';
import { UpdateBankAccountDto } from '@/users/dto/update-bank-account.dto';

@Injectable()
export class UsersService {
	private readonly logger = new Logger(UsersService.name);

	constructor(
		private readonly prismaService: PrismaService,
		private readonly payOSService: PayOSService,
		@Inject('ClerkClient')
		private readonly clerkClient: ClerkClient,
	) {}

	async findAll() {
		const users = await this.prismaService.user.findMany();

		this.logger.debug('Users found:', users);

		const detailedUsers = await Promise.all(
			users.map(async (user) => {
				const clerkUser = await this.clerkClient.users.getUser(user.clerkId);
				return { ...user, clerkUser };
			}),
		);

		this.logger.debug('Detailed users:', detailedUsers);

		return detailedUsers;
	}

	async findOne(valueId: string): Promise<any> {
		try {
			let user;

			if (!isNaN(+valueId)) {
				user = await this.prismaService.user.findUnique({
					where: { id: +valueId },
				});
			} else {
				user = await this.prismaService.user.findUnique({
					where: { clerkId: valueId },
				});
			}

			if (!user) {
				throw new NotFoundException('User not found');
			}

			this.logger.log(`User found with identifier: ${valueId}`);
			this.logger.debug(user);

			return user;
		} catch (error: any) {
			this.logger.error(error);
			throw error;
		}
	}

	async findOneClerk(valueId: string): Promise<any> {
		try {
			const user = await this.findOne(valueId);

			const clerkUser = await this.clerkClient.users.getUser(user.clerkId);

			return clerkUser;
		} catch (error: any) {
			this.logger.error(error);
			throw error;
		}
	}

	async syncDatabaseFromLearner(@Req() req: RawBodyRequest<Request>) {
		const SIGNING_SECRET = process.env.SIGNING_SECRET;

		if (!SIGNING_SECRET) {
			throw new BadRequestException(
				'Please add SIGNING_SECRET from Clerk Dashboard to .env',
			);
		}

		this.logger.debug('Request', req);

		// Create new Svix instance with secret
		const wh = new Webhook(SIGNING_SECRET);

		// Get headers and body from the request
		const headers = req.headers;
		const payload = req.rawBody?.toString('utf8') || '';

		// Extract Svix headers for verification
		const svix_id = headers['svix-id'];
		const svix_timestamp = headers['svix-timestamp'];
		const svix_signature = headers['svix-signature'];

		// If there are no headers, throw an error
		if (!svix_id || !svix_timestamp || !svix_signature) {
			throw new BadRequestException('Error: Missing svix headers');
		}

		let evt: any;

		// Attempt to verify the incoming webhook
		try {
			evt = wh.verify(payload, {
				'svix-id': svix_id as string,
				'svix-timestamp': svix_timestamp as string,
				'svix-signature': svix_signature as string,
			});
		} catch (err) {
			this.logger.error('Error: Could not verify webhook:', err.message);

			throw new BadRequestException(err.message);
		}

		// Process the payload (log it in this case)
		const { id } = evt.data;
		const eventType = evt.type;

		this.logger.log(
			`Received webhook with ID ${id} and event type of ${eventType}`,
		);
		this.logger.log('Webhook payload:', evt.data);

		const exsitedUser = await this.prismaService.user.findUnique({
			where: { clerkId: id },
		});

		if (!exsitedUser) {
			this.logger.log('Info: User not found');

			// Save clerkId to database
			const newUser = await this.prismaService.user.create({
				data: {
					clerkId: id,
				},
			});

			this.logger.log('User created:', newUser);

			// Set role `learner` to user in Clerk
			const clerkUser = await this.clerkClient.users.updateUser(id, {
				publicMetadata: {
					role: 'learner',
				},
			});

			this.logger.log('Updated role to learner with clerkId', id);
			this.logger.debug(clerkUser);
		} else {
			this.logger.log('User found:', exsitedUser);
		}

		// Optionally, handle any further processing with the payload data
		return { success: true, message: 'Webhook received' };
	}

	async becomeATeacher(becomeATeacherDto: BecomeATeacherDto) {
		const user = await this.prismaService.user.findUnique({
			where: { id: becomeATeacherDto.userId },
		});

		if (!user) {
			throw new NotFoundException('User not found');
		}

		this.logger.log('User found with id: ' + becomeATeacherDto.userId);
		this.logger.debug(user);

		const items = [
			{
				name: 'Register to become a potential teacher of the BrainBox platform.',
				quantity: 1,
				price: becomeATeacherDto.price,
			},
		];

		const existingPayment = await this.prismaService.payment.findFirst({
			where: {
				userId: becomeATeacherDto.userId,
				courseId: null,
				status: 'paid',
			},
		});

		if (existingPayment) {
			this.logger.debug(
				`User ${becomeATeacherDto.userId} has already paid for Become a Teacher`,
			);
			throw new ConflictException('User has already paid for Become a Teacher');
		}

		const newPayment = await this.prismaService.payment.create({
			data: {
				userId: becomeATeacherDto.userId,
				price: becomeATeacherDto.price,
			},
		});

		const checkoutUrl = await this.payOSService.createPaymentLink(
			newPayment.id,
			Number(newPayment.price),
			items,
			'BrainBox Become a Teacher',
		);

		if (!checkoutUrl) {
			this.logger.error('Checkout URL not found in the response');
			throw new Error('Checkout URL not found');
		}

		return checkoutUrl;
	}

	async getTopTeachers(top: number) {
		const topTeachers = await this.prismaService.user.findMany({
			where: {
				courses: {
					some: {
						payments: {
							some: {
								status: 'paid',
							},
						},
					},
				},
			},
			select: {
				id: true,
				clerkId: true,
				_count: {
					select: {
						courses: {
							where: {
								payments: {
									some: {
										status: 'paid',
									},
								},
							},
						},
					},
				},
			},
			orderBy: {
				courses: {
					_count: 'desc',
				},
			},
			take: top,
		});

		this.logger.debug('Top teachers:', topTeachers);

		const detailedTeachers = await Promise.all(
			topTeachers.map(async (teacher) => {
				const clerkUser = await this.findOneClerk(teacher.id.toString());
				return { ...teacher, clerkUser };
			}),
		);

		this.logger.debug('Detailed top teachers:', detailedTeachers);

		return detailedTeachers;
	}

	async createBankAccount(teacherId: number, dto: CreateBankAccountDto) {
		const teacher = await this.prismaService.user.findUnique({
			where: { id: teacherId },
		});

		if (!teacher) {
			this.logger.debug(`Teacher ${teacherId} not found`);
			throw new NotFoundException('Teacher not found');
		}

		const existingPayment = await this.prismaService.payment.findFirst({
			where: {
				userId: teacherId,
				courseId: null,
				status: 'paid',
			},
		});

		if (!existingPayment) {
			this.logger.debug(`User ${teacherId} has not paid for Become a Teacher`);
			throw new ConflictException('User has not paid for Become a Teacher');
		}

		const clerkUser = await this.clerkClient.users.getUser(teacher.clerkId);

		if (!clerkUser) {
			throw new NotFoundException('Clerk user not found');
		}

		this.logger.debug(clerkUser);

		const existingMetadata = clerkUser.publicMetadata || {};

		const newBankAccount = await this.clerkClient.users.updateUser(
			teacher.clerkId,
			{
				publicMetadata: {
					...existingMetadata,
					bank_account: {
						bank_name: dto.bank_name,
						account_number: dto.account_number,
						account_holder: dto.account_holder,
					},
				},
			},
		);

		this.logger.debug('Bank account created:', newBankAccount);
		this.logger.log('Bank account created for teacher:', teacherId);

		return newBankAccount;
	}

	async updateBankAccount(teacherId: number, dto: UpdateBankAccountDto) {
		const teacher = await this.prismaService.user.findUnique({
			where: { id: teacherId },
		});

		if (!teacher) {
			this.logger.debug(`Teacher ${teacherId} not found`);
			throw new NotFoundException('Teacher not found');
		}

		const clerkUser = await this.clerkClient.users.getUser(teacher.clerkId);

		if (!clerkUser) {
			throw new NotFoundException('Clerk user not found');
		}

		this.logger.debug(clerkUser);

		const existingMetadata = clerkUser.publicMetadata || {};

		const updatedBankAccount = await this.clerkClient.users.updateUser(
			teacher.clerkId,
			{
				publicMetadata: {
					...existingMetadata,
					bank_account: {
						bank_name: dto.bank_name,
						account_number: dto.account_number,
						account_holder: dto.account_holder,
					},
				},
			},
		);

		this.logger.debug('Bank account updated:', updatedBankAccount);
		this.logger.log('Bank account updated for teacher:', teacherId);

		return updatedBankAccount;
	}
}
