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

| #   | Name | Description | Example                       |
| --- | ---- | ----------- | ----------------------------- |
| 1   | ENV  | Environment | `development` or `production` |

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
  pnpm run start:dev
  ```
