# Expense Tracker Application

## Overview
This is a full-stack expense tracking application for managing mobile money expenses. Built with React (frontend) and Express (backend), it allows users to track transactions, set budgets, and monitor spending across different categories.

## Recent Changes
- **2025-10-02**: Budget enhancements and export functionality
  - Added overspending alerts with visual indicators and toast notifications
  - Implemented monthly budget review showing last 3 months with spending trends
  - Added CSV export functionality for transactions and budgets in Profile section
  - Fixed alert dependency to properly track category changes
- **2025-10-02**: Initial project import and setup in Replit environment
  - Configured workflow to run on port 5000 with webview output
  - Database schema already pushed to Neon PostgreSQL
  - Verified authentication system is working correctly
  - Deployment configuration set to autoscale

## Architecture

### Tech Stack
- **Frontend**: React + Vite + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL (Neon Serverless)
- **ORM**: Drizzle ORM
- **Authentication**: Express sessions with PostgreSQL session store
- **Routing**: Wouter (client-side)

### Project Structure
```
client/          - React frontend application
  src/
    components/  - Reusable UI components (shadcn + custom)
    pages/       - Page components (Dashboard, Transactions, Budget, etc.)
    hooks/       - Custom React hooks
    lib/         - Utilities and query client setup
server/          - Express backend
  index.ts       - Main server entry point
  routes.ts      - API route handlers
  storage.ts     - Database access layer
  vite.ts        - Vite dev server setup
shared/          - Shared types and schemas
  schema.ts      - Drizzle schema definitions and Zod validation
```

### Key Features
1. **User Authentication**: Signup/login with bcrypt password hashing
2. **Transaction Management**: Create, read, update, delete expense transactions
3. **Budget Management**: 
   - Set and track spending limits by category
   - Overspending alerts with visual indicators and notifications
   - Monthly budget review showing last 3 months with trends
4. **Categories**: Food, Transport, Airtime, Other
5. **Mobile Money Services**: MTN, AirtelTigo, Telecel
6. **Analytics**: Dashboard with spending trends and category breakdowns
7. **Data Export**: CSV export of transactions, budgets, and summary data

## Database Schema

### Tables
1. **users**: User accounts with email authentication
2. **transactions**: Expense records linked to users
3. **budgets**: Budget limits per category per user
4. **session**: Express session storage (auto-created)

## Configuration

### Environment Variables
- `DATABASE_URL`: Neon PostgreSQL connection string (configured)
- `SESSION_SECRET`: Secret for session management (configured)
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment mode (development/production)

### Development
- Server binds to `0.0.0.0:5000` to work with Replit's proxy
- Vite configured with `allowedHosts: true` for Replit iframe proxy
- HMR (Hot Module Replacement) enabled for fast development

### Deployment
- **Target**: Autoscale (stateless web application)
- **Build**: `npm run build` (builds both frontend and backend)
- **Run**: `npm run start` (production server)

## User Preferences
None documented yet.

## Running the Project

### Development
The workflow "Start application" runs `npm run dev` which:
1. Starts Express server in development mode
2. Sets up Vite dev server with HMR
3. Serves on port 5000

### Database Operations
- `npm run db:push`: Push schema changes to database
- Database uses Neon serverless PostgreSQL with websocket connections

### Scripts
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run check`: TypeScript type checking
- `npm run db:push`: Push database schema

## Notes
- Application uses in-memory sessions in development, PostgreSQL-backed sessions in production
- Frontend uses TanStack Query for data fetching and caching
- All API routes are under `/api/*` prefix
- Authentication required for all protected routes
