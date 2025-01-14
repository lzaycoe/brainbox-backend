/*
 *  ======================================================================
 *  Copyright (C) 2025 - lzaycoe (Lazy Code)
 *  ======================================================================
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 *  ======================================================================
 */
import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';

/**
 * Middleware that integrates Morgan logging with NestJS.
 *
 * This middleware uses Morgan to log HTTP requests in the 'dev' format and
 * redirects the log output to the NestJS logger.
 *
 * @class
 * @implements {NestMiddleware}
 */
@Injectable()
export class MorganMiddleware implements NestMiddleware {
	private readonly logger = new Logger(MorganMiddleware.name);

	/**
	 * Method that applies the Morgan middleware to log HTTP requests.
	 *
	 * @param {Request} req - The incoming HTTP request.
	 * @param {Response} res - The outgoing HTTP response.
	 * @param {NextFunction} next - The next middleware function in the request-response cycle.
	 */
	use(req: Request, res: Response, next: NextFunction) {
		morgan('dev', {
			stream: {
				write: (message: string) => this.logger.log(message.trim()),
			},
		})(req, res, next);
	}
}
