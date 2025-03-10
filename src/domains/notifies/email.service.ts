import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

import { emailSignature } from '@/notifies/template/email-signature';
import { withdrawalRejected } from '@/notifies/template/withdrawal-rejected';
import { withdrawalSuccess } from '@/notifies/template/withdrawal-success';

@Injectable()
export class EmailService {
	private readonly transporter;

	constructor() {
		this.transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: process.env.EMAIL_USERNAME,
				pass: process.env.EMAIL_PASSWORD,
			},
			debug: true,
			logger: true,
			secure: true,
			tls: {
				rejectUnauthorized: false,
			},
		});
	}

	async sendEmail(
		to: string,
		subject: string,
		teacherName: string,
		amount: string,
		transactionDate: string,
		template: 'withdrawal-success' | 'withdrawal-rejected',
	) {
		let htmlContent = '';

		const templateMap = {
			'withdrawal-success': withdrawalSuccess,
			'withdrawal-rejected': withdrawalRejected,
		};

		if (templateMap[template]) {
			htmlContent = templateMap[template]
				.replaceAll('{{TEACHER_NAME}}', teacherName)
				.replaceAll('{{AMOUNT}}', amount)
				.replaceAll('{{TRANSACTION_DATE}}', transactionDate)
				.replaceAll(
					'{{EMAIL_USERNAME}}',
					process.env.EMAIL_USERNAME || 'brainbox.platform@gmail.com',
				);
		}

		let signature = emailSignature;
		if (typeof signature === 'string') {
			signature = signature
				.replaceAll(
					'{{FRONTEND_URL}}',
					process.env.FRONTEND_URL || 'https://brainbox-platform.vercel.app',
				)
				.replaceAll(
					'{{EMAIL_USERNAME}}',
					process.env.EMAIL_USERNAME || 'brainbox.platform@gmail.com',
				);
		}

		const mailOptions = {
			from: process.env.EMAIL_USERNAME,
			to,
			subject,
			html: htmlContent + signature,
		};

		try {
			await this.transporter.sendMail(mailOptions);
		} catch (error) {
			console.error('Error sending email:', error);
		}
	}
}
