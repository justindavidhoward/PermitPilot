# PermitPilot Backend API

AI-powered permit determination engine and management platform.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables (copy `.env.example` to `.env`):
   ```
   PORT=3000
   JWT_SECRET=your-secret-key
   NODE_ENV=development
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

- `GET /health` - Server health check
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile (requires Bearer token)

## Database

Uses the shared team database via `team-db` CLI. Tables:
- `users`
- `projects`
- `permit_requirements`
- `documents`
- `subscriptions`
