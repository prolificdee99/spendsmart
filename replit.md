# SpendSmart - Mobile Money Expense Tracker

## Overview
SpendSmart is a full-stack expense tracker built for students to track mobile money expenses in Ghana. The application uses phone numbers instead of email for authentication, supporting MTN, AirtelTigo, and Telecel mobile money services.

## Tech Stack
- **Frontend**: React + Vite + TailwindCSS + shadcn/ui
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL (Neon-backed via Replit)
- **Authentication**: Express-Session with PostgreSQL session store
- **ORM**: Drizzle ORM

## Project Structure
```
├── client/              # Frontend React application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── lib/         # Utilities and API client
│   │   └── pages/       # Page components (Auth, Dashboard, etc.)
├── server/              # Backend Express application
│   ├── index.ts         # Server entry point
│   ├── routes.ts        # API route definitions
│   ├── storage.ts       # Database access layer
│   └── vite.ts          # Vite middleware setup
├── shared/              # Shared types and schemas
│   └── schema.ts        # Drizzle database schemas
└── .env                 # Environment variables (not in git)
```

## Recent Changes (October 3, 2025)
### GitHub Import Setup
- Fixed schema mismatch: Updated from email-based to phone-based authentication
- Updated `storage.ts` to use phone field for user lookup
- Updated `routes.ts` to accept phone number in login/signup
- Updated frontend Auth and Profile pages to use phone instead of email
- Fixed ES module issues in `vite.config.ts` (__dirname not available)
- Configured Vite to allow all hosts for Replit proxy support
- Created PostgreSQL database and pushed schema
- Configured workflow to run on port 5000
- Set up deployment for autoscale

## Environment Setup
The application requires the following environment variables (already configured):
- `DATABASE_URL`: PostgreSQL connection string (auto-configured by Replit)
- `SESSION_SECRET`: Secret for session encryption (auto-generated)
- `PORT`: Server port (set to 5000)

## Development
The application runs on port 5000 in development mode with:
- Hot Module Replacement (HMR) via Vite
- Express backend serving both API and frontend
- PostgreSQL session storage for authentication

### Running Locally
The workflow "Start application" is configured to run:
```bash
NODE_ENV=development npm run dev:server
```

This starts the Express server which:
1. Serves API routes at `/api/*`
2. Integrates Vite middleware for frontend development
3. Runs on port 5000 with host 0.0.0.0

## Database Schema
### Users
- `id`: UUID (auto-generated)
- `name`: Text (full name)
- `phone`: Varchar(15) (10-15 digits, unique)
- `password`: Text (bcrypt hashed)
- `createdAt`: Timestamp

### Transactions
- `id`: UUID
- `userId`: Foreign key to users
- `amount`: Decimal(10,2)
- `category`: Enum (Food, Transport, Airtime, Other)
- `service`: Enum (MTN, AirtelTigo, Telecel)
- `notes`: Text (optional)
- `date`: Timestamp

### Budgets
- `id`: UUID
- `userId`: Foreign key to users
- `category`: Enum (Food, Transport, Airtime, Other)
- `limit`: Decimal(10,2)
- `period`: Enum (daily, weekly, monthly)
- `createdAt`: Timestamp
- `updatedAt`: Timestamp

## Deployment
Configured for Replit Autoscale deployment:
- Build command: `npm run build`
- Start command: `npm run start`
- Production builds compile both frontend (Vite) and backend (esbuild)

## API Endpoints
### Authentication
- `POST /api/auth/signup` - Create new user (requires name, phone, password)
- `POST /api/auth/login` - Login (requires phone, password)
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Transactions
- `GET /api/transactions` - List all user transactions
- `GET /api/transactions/:id` - Get single transaction
- `POST /api/transactions` - Create transaction
- `PATCH /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Budgets
- `GET /api/budgets` - List all user budgets
- `GET /api/budgets/:id` - Get single budget
- `POST /api/budgets` - Create/update budget (auto-updates if exists)
- `PATCH /api/budgets/:id` - Update budget
- `DELETE /api/budgets/:id` - Delete budget

### Analytics
- `GET /api/analytics/summary` - Get spending summary and budget status

## Architecture Decisions
### Phone-Based Authentication
The application uses phone numbers instead of email addresses, reflecting the mobile money context where phone numbers are the primary identifier.

### Single Port Architecture
Both frontend and backend run on port 5000. In development, Express uses Vite middleware mode. In production, Express serves pre-built static files.

### Session Storage
Uses PostgreSQL for session storage (via connect-pg-simple) instead of in-memory storage, ensuring sessions persist across server restarts and scale horizontally.

## User Preferences
None documented yet.
