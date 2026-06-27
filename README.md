# Reis Enterprise SaaS

This repository contains the codebase for the Reis Enterprise SaaS platform. It is structured as a monorepo managed by [Turborepo](https://turbo.build/repo/docs) and npm workspaces.

## Structure

The monorepo contains the following main directories:

- `apps/api`: The backend REST API built with [NestJS](https://nestjs.com/). It uses Prisma for ORM, PostgreSQL for the database, and Redis/BullMQ for queues and caching.
- `apps/web`: The frontend web application built with [Next.js](https://nextjs.org/). It uses Tailwind CSS for styling, React Query for data fetching, and Zustand for state management.
- `client-website`: A static HTML/CSS/JavaScript landing/marketing website.
- `packages/*` (if applicable): Shared packages used across the applications.

## How it works

The project leverages Turborepo to efficiently build, lint, and run all applications in the monorepo concurrently. 

- The **API** provides the core business logic, database interactions, and exposes RESTful endpoints (documented via Swagger/OpenAPI).
- The **Web** app is the primary user interface, built with server-side rendering (SSR) capabilities of Next.js to interact with the API.
- Turborepo caches task executions to speed up the development and build processes.

## How to use and run

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v10+ recommended)
- PostgreSQL (for the API database)
- Redis (for caching and queues in the API)

### 1. Install dependencies

Run the following command at the root of the project to install all dependencies for the entire monorepo:

```bash
npm install
```

### 2. Environment Variables

Before running the application, make sure to configure the environment variables. Typically, you will need to create a `.env` file in the `apps/api` and `apps/web` directories based on their respective `.env.example` files (if available), providing your database connection strings and other secrets.

### 3. Run the development server

To start the development servers for all applications simultaneously, run:

```bash
npm run dev
```

This command uses Turborepo (`turbo run dev`) to start both the NestJS API and the Next.js web application.

- **Web App**: Typically accessible at [http://localhost:3000](http://localhost:3000)
- **API**: Typically accessible at [http://localhost:3001](http://localhost:3001) (Swagger docs are usually available at `/api/docs` or similar, depending on configuration).

### Other Commands

- **Build all apps**: `npm run build`
- **Lint all apps**: `npm run lint`
- **Format code**: `npm run format`
