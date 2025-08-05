# Lifeline Dashboard

This is a [Next.js](https://nextjs.org) project for handling monitoring heartbeat of the [Lifeline](https://github.com/angga2oioi/lifeline) project.

## Table of Contents
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Scripts](#scripts)
- [Features](#features)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

To get started with this project, first clone the repository and install the required dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### Running the Development Server

After installing dependencies, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

When you access the application for the first time, it will prompt you to create an account. Once logged in, you can add and manage additional accounts as needed.

## Project Structure

```plaintext
├── .gitignore
├── eslint.config.mjs
├── jsconfig.json
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── README.md
├── src
│   ├── app
│   │   ├── api
│   │   │   └── v1
│   │   │       ├── accounts
│   │   │       │   ├── me
│   │   │       │   │   └── route.js
│   │   │       │   ├── route.js
│   │   │       │   └── ...
│   │   │       ├── auths
│   │   │       │   └── route.js
│   │   │       ├── events
│   │   │       │   └── route.js
│   │   │       └── ...
│   │   ├── dashboard
│   │   │   ├── accounts
│   │   │   │   └── page.js
│   │   │   ├── instances
│   │   │   └── ...
│   │   ├── client
│   │   │   ├── api
│   │   │   ├── hooks
│   │   │   ├── components
│   │   │   └── ...
│   │   ├── middleware.js
│   │   └── server
│   │       ├── module
│   │       └── utils
│   ├── global
│   │   └── utils
│   │       ├── constant.js
│   │       ├── functions.js
│   │       └── ...
│   └── ...
├── tailwind.config.mjs
└── ...
```

## Scripts

These are the main scripts included in the `package.json` file:

- **`dev`**: Start the development server.
- **`build`**: Build the application for production usage.
- **`start`**: Start the production server.
- **`lint`**: Run ESLint to lint the code.

## Features

- User authentication and authorization.
- Dashboard for monitoring various metrics.
- Create, update, and delete accounts, projects, and services.
- Real-time status updates via event logging.

## API Endpoints

The API is structured under the **/api** directory, organized into various resource types such as accounts, auths, services, and more. 

### Example Endpoints

- **Accounts**
  - `GET /api/v1/accounts` - Retrieve a list of accounts.
  - `POST /api/v1/accounts` - Create a new account.
  
- **Authentication**
  - `POST /api/v1/auths/login` - Log in to the application.
  - `POST /api/v1/auths/logout` - Log out from the application.

- **Projects**
  - `GET /api/v1/projects` - Retrieve a list of projects.
  - `POST /api/v1/projects` - Create a new project.

For a full list of API endpoints and their specifications, please refer to the source code or API documentation.

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit them (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Feel free to customize this README to better fit your project's unique requirements!