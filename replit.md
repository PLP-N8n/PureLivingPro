# Pure Living Pro - Wellness & Health Platform

## Overview

Pure Living Pro is a comprehensive wellness and health platform built as a full-stack web application. It combines AI-powered wellness coaching, content management, e-commerce capabilities, and community features to provide users with a complete wellness journey. The platform integrates personalized recommendations, premium content, meditation tools, and wellness product curation.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS with custom wellness color palette (sage and earth tones)
- **UI Components**: Radix UI components with shadcn/ui styling system
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing
- **Animations**: Framer Motion for smooth transitions and micro-interactions

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript throughout the stack
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: Express sessions with PostgreSQL store
- **Authentication**: Replit Auth with OpenID Connect

### Monorepo Structure
- **`client/`**: React frontend application
- **`server/`**: Express.js backend API
- **`shared/`**: Shared TypeScript schemas and types
- **`migrations/`**: Database migration files

## Key Components

### Authentication & User Management
- Replit Auth integration with OpenID Connect
- Session-based authentication with PostgreSQL storage
- Premium subscription management with Stripe integration
- User profile management with wellness preferences

### Content Management System
- Blog post management with premium content gating
- Rich text content support
- Category-based content organization
- SEO-friendly slug-based routing

### AI-Powered Wellness Features
- **OpenAI Integration**: GPT-4o for personalized wellness plan generation
- **Wellness Quiz**: Collects user preferences and goals
- **Personalized Recommendations**: AI-generated daily plans and content
- **Mood Analysis**: AI-powered mood tracking and activity suggestions

### E-commerce & Product Management
- Curated wellness product recommendations
- Affiliate link management
- Product categorization and search
- User wishlist and favorites

### Challenge System
- Community wellness challenges
- Progress tracking and analytics
- User participation and leaderboards
- Daily logging and habit tracking

### Premium Features
- Subscription-based premium content access
- Advanced AI coaching features
- Extended meditation library
- Expert consultation access

## Data Flow

1. **User Registration**: Users authenticate via Replit Auth, creating a session
2. **Profile Setup**: Wellness quiz collects preferences and goals
3. **AI Processing**: OpenAI generates personalized wellness plans
4. **Content Delivery**: Blog posts and products filtered by user preferences
5. **Progress Tracking**: Daily logs and challenge participation stored
6. **Premium Access**: Stripe subscription status controls feature access

## External Dependencies

### Core Services
- **Neon Database**: Serverless PostgreSQL hosting
- **OpenAI API**: AI-powered content generation and analysis
- **Stripe**: Payment processing and subscription management
- **SendGrid**: Email communications and notifications
- **Replit Auth**: User authentication and session management

### Development Tools
- **Vite**: Frontend build tool and development server
- **Drizzle Kit**: Database migrations and schema management
- **TypeScript**: Type safety across the entire stack
- **ESBuild**: Backend bundling for production

## Deployment Strategy

### Development Environment
- **Frontend**: Vite development server with hot reload
- **Backend**: tsx for TypeScript execution with auto-restart
- **Database**: Connection to Neon serverless PostgreSQL

### Production Build
- **Frontend**: Vite builds optimized React bundle to `dist/public`
- **Backend**: ESBuild creates Node.js bundle from TypeScript source
- **Database**: Drizzle migrations applied via `npm run db:push`

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `OPENAI_API_KEY`: OpenAI API access key
- `STRIPE_SECRET_KEY`: Stripe payment processing
- `SENDGRID_API_KEY`: Email service integration
- `SESSION_SECRET`: Session encryption key
- `REPLIT_DOMAINS`: Authentication domain configuration

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- July 07, 2025. Initial setup