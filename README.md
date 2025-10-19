# Arthamatics Finance

A secure finance company platform for stock and mutual fund distribution, built with Next.js, TypeScript, and MySQL.

## Features

- **Customer Onboarding**: Secure registration with KYC compliance
- **Authentication**: JWT-based authentication with role-based access
- **Admin Panel**: Manage customers and view reports
- **Database**: MySQL with Prisma ORM
- **Security**: Password hashing, protected routes

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MySQL (hosted on alwaysdata.net)
- **Authentication**: NextAuth.js
- **ORM**: Prisma
- **Deployment**: Vercel

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables in `.env`:
   ```
   DATABASE_URL="mysql://username:password@host:port/database"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. Run database migrations:
   ```bash
   npx prisma db push
   ```

5. Seed the database (optional):
   ```bash
   npx tsx src/scripts/seed.ts
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Vercel

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (set to your production URL)
3. Deploy

## Database Schema

- **User**: Authentication and role management
- **Customer**: Customer profiles and KYC information

## Security

- Passwords are hashed using bcrypt
- JWT tokens for session management
- Protected routes with middleware
- Environment variables for sensitive data

## Admin Access

Default admin credentials:
- Email: admin@arthamatics.in
- Password: admin123

*Change the default password in production!*
