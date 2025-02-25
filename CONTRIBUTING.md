# brainbox-backend's Development Guidelines

## Table of Contents

- [brainbox-backend's Development Guidelines](#brainbox-backends-development-guidelines)
  - [Table of Contents](#table-of-contents)
  - [Requirements](#requirements)
    - [Tools](#tools)
    - [Extensions](#extensions)
    - [Commit Conventions](#commit-conventions)
    - [Environment Variables](#environment-variables)
  - [Development](#development)

---

## Requirements

### Tools

- Environment: `Node.js v20.17.0`
  - You can download it from [here](https://nodejs.org/en/download/).
- Package manager: `pnpm`
  - To install it, run `npm i -g pnpm` after installing Node.js.
- Code editor: `Visual Studio Code`
  - You can download it from [here](https://code.visualstudio.com/).

### Extensions

- [EditorConfig for VS Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)
- [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prisma](https://marketplace.visualstudio.com/items?itemName=Prisma.prisma)

### Commit Conventions

Format: `<type>: <subject>`

Conventions:

- `add`: Add a new code what does not exist.
- `update`: Update an existing code.
- `fix`: Fix a bug, issue, or error, tool scan warning.
- `docs`: Update or add documentation.
- `feat`: Add a new feature. (Usually used in the PR title)
- `refactor`: Refactor an existing code.
- `delete`: Delete an existing code.

Examples:

- `add: add a new feature`
- `update: update a function`
- `fix: fix a bug`
- `docs: update contributing guidelines`
- `feat: add a new feature`
- `refactor: refactor a function`
- `delete: delete a function`

> **Note**: Please follow the conventions to keep the commit history clean and easy to read.

### Environment Variables

Create a .env file there and add the following environment variables:

| #   | Name                      | Description                                         | Example values                                       |
| --- | ------------------------- | --------------------------------------------------- | ---------------------------------------------------- |
| 1   | NODE_ENV                  | Environment                                         | `development` or `production`                        |
| 2   | DATABASE_URL              | Database URL                                        | `postgresql://user:password@localhost:5432/brainbox` |
| 3   | DIRECT_URL                | Database direct URL                                 | `postgresql://user:password@localhost:5432/brainbox` |
| 4   | CLERK_PUBLISHABLE_KEY     | Clerk public API key                                | `clerk_public_api_key`                               |
| 5   | CLERK_SECRET_KEY          | Clerk secret key                                    | `clerk_secret_key`                                   |
| 6   | JWT_ACCESS_TOKEN_SECRET   | JWT access token secret key                         | `jwt_secret_key`                                     |
| 7   | JWT_ACCESS_TOKEN_EXPIRES  | JWT access token expires in                         | `1d` or `1h` or `1m` or `1s`                         |
| 8   | JWT_REFRESH_TOKEN_SECRET  | JWT refresh token secret key                        | `jwt_secret_key`                                     |
| 9   | JWT_REFRESH_TOKEN_EXPIRES | JWT refresh token expires in                        | `7d` or `7h` or `7m` or `7s`                         |
| 10  | ALLOWED_ORIGINS           | The allowed origins for CORS (separated by commas ) | `http://localhost:3000,http://localhost:3001`        |
| 11  | PAYOS_BASE_URL            | payOS base URL                                      | `https://api-merchant.payos.vn`                      |
| 12  | PAYOS_CLIENT_ID           | payOS client ID                                     | `payos_client_id`                                    |
| 13  | PAYOS_API_KEY             | payOS API key                                       | `payos_api_key`                                      |
| 14  | PAYOS_CHECKSUM_KEY        | payOS checksum key                                  | `payos_checksum_key`                                 |
| 14  | FRONTEND_URL              | Frontend Url                                        | `http://localhost:3000`                              |

---

## Development

- Step 1: Clone the repository.

  ```bash
  git clone https://github.com/lzaycoe/brainbox-backend.git
  ```

- Step 2: Install dependencies

  ```bash
  cd brainbox-backend
  pnpm install
  ```

- Step 3: Create `.env` file and add the environment variables mentioned above.

- Step 4: Run the development server.

  ```bash
  pnpm run prisma:generate
  pnpm run start:dev
  ```
