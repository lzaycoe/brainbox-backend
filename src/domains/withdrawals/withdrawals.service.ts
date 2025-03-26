import {
	ConflictException,
	Injectable,
	Logger,
	NotFoundException,
} from '@nestjs/common';

import { EmailService } from '@/notifies/email.service';
import { PrismaService } from '@/providers/prisma.service';
import { RevenuesService } from '@/revenues/revenues.service';
import { UsersService } from '@/users/users.service';
import { CreateWithdrawalDto } from '@/withdrawals/dto/create-withdrawal.dto';
import { UpdateWithdrawalDto } from '@/withdrawals/dto/update-withdrawal.dto';

@Injectable()
export class WithdrawalsService {
	private readonly logger = new Logger(WithdrawalsService.name);

	constructor(
		private readonly prismaService: PrismaService,
		private readonly revenuesService: RevenuesService,
		private readonly emailService: EmailService,
		private readonly usersService: UsersService,
	) {}

	async create(dto: CreateWithdrawalDto) {
		const revenue = await this.revenuesService.findByTeacherId(dto.teacherId);

		if (!revenue || +revenue.availableForWithdraw < dto.amount) {
			this.logger.error(`Insufficient funds for teacher ${dto.teacherId}`);
			throw new ConflictException(
				`Insufficient funds for teacher ${dto.teacherId}`,
			);
		}

		this.logger.log('Creating a new withdrawal');

		const withdrawal = await this.prismaService.withdrawal.create({
			data: dto,
		});

		this.logger.debug('Withdrawal created', withdrawal);
		this.logger.log(`Withdrawal created: ${withdrawal.id}`);

		return withdrawal;
	}

	async findAll() {
		this.logger.log('Finding all withdrawals');

		const withdrawals = await this.prismaService.withdrawal.findMany();

		const withdrawalsWithBankAccounts = await Promise.all(
			withdrawals.map(async (withdrawal) => {
				const user = await this.usersService.findOneClerk(
					withdrawal.teacherId.toString(),
				);
				const bankAccount = user?.publicMetadata?.bank_account;
				return { ...withdrawal, bankAccount };
			}),
		);

		this.logger.debug('Withdrawals found', withdrawalsWithBankAccounts);
		this.logger.log(`Found ${withdrawalsWithBankAccounts.length} withdrawals`);

		return withdrawalsWithBankAccounts;
	}

	async findOne(id: number) {
		this.logger.log(`Finding withdrawal with ID ${id}`);

		const withdrawal = await this.prismaService.withdrawal.findUnique({
			where: { id },
		});

		if (!withdrawal) {
			this.logger.error(`Withdrawal with ID ${id} not found`);
			throw new NotFoundException('Withdrawal not found');
		}

		const user = await this.usersService.findOneClerk(
			withdrawal.teacherId.toString(),
		);

		const bankAccount = user?.publicMetadata?.bank_account;

		this.logger.debug('Withdrawal found', withdrawal);
		this.logger.log(`Found withdrawal with ID ${id}`);

		return { withdrawal, bankAccount };
	}

	async update(id: number, dto: UpdateWithdrawalDto) {
		this.logger.log(`Updating withdrawal with ID ${id}`);

		const withdrawal = await this.prismaService.withdrawal.update({
			where: { id },
			data: dto,
		});

		this.logger.debug('Withdrawal updated', withdrawal);
		this.logger.log(`Updated withdrawal with ID ${id}`);

		if (dto.status === 'approved' || dto.status === 'rejected') {
			if (dto.status === 'approved') {
				await this.revenuesService.updateTotalWithdrawn(
					withdrawal.teacherId,
					+withdrawal.amount,
				);

				this.logger.log('Revenue updated');
			}

			const teacher = await this.usersService.findOneClerk(
				withdrawal.teacherId.toString(),
			);

			this.logger.debug('Teacher found', teacher);

			const email = teacher.emailAddresses?.[0]?.emailAddress;

			this.logger.debug('Sending email to', email);
			const subject =
				dto.status === 'approved'
					? '[BrainBox] Withdrawal Request Approved'
					: '[BrainBox] Withdrawal Request Rejected';
			const teacherName = teacher.firstName + ' ' + teacher.lastName;

			this.logger.debug('Teacher Name', teacherName);
			const amount = new Intl.NumberFormat('vi-VN', {
				style: 'currency',
				currency: 'VND',
			}).format(+withdrawal.amount);
			const transactionDate = new Date(withdrawal.updateAt)
				.toISOString()
				.split('T')[0];
			const template =
				dto.status === 'approved'
					? 'withdrawal-success'
					: 'withdrawal-rejected';

			await this.emailService.sendEmail(
				email,
				subject,
				teacherName,
				amount,
				transactionDate,
				template,
			);

			this.logger.log('Email sent successfully');
		}

		return withdrawal;
	}
}
