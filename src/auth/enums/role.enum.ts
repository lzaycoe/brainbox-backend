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
/**
 * Enum representing different user roles within the application.
 *
 * @enum {string}
 * @property {string} LEARNER - Represents a learner user role.
 * @property {string} LECTURER - Represents a lecturer user role.
 * @property {string} ADMIN - Represents an admin user role.
 */
export enum Role {
	LEANRER = 'learner',
	LECTURER = 'lecturer',
	ADMIN = 'admin',
}
