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

### Brand Design System
- **Primary Color**: Tulsi leaf green (nature-inspired herbal green) - representing freshness and wellness
- **Secondary Colors**: Soft neutrals and white for minimalist, calm aesthetic
- **Accent Colors**: Subtle earthy tones (light beige/sand) used sparingly for warmth
- **Typography**: Clean, modern sans-serif fonts for readability and professional warmth
- **Design Principles**: Minimalist approach with white space, simple card layouts, strong visual hierarchy, soft hover effects

## Project Blueprint

The project follows a detailed wireframe specification with:
- Public pages: Home, Blog, Wellness Picks, About, Contact, Premium
- User pages: Dashboard, Wellness Plan, Meal Planner, Meditation Timer, Challenges
- Admin pages: Content management and system configuration
- Features: AI-powered wellness coaching, premium subscriptions, personalized recommendations

## Changelog

Changelog:
- July 07, 2025. Initial setup with complete database schema and API integrations
- July 07, 2025. Added comprehensive wireframe specification for all platform features
- July 07, 2025. Completed comprehensive admin dashboard with full content management system
- July 07, 2025. Implemented blog post management with create, edit, delete, and publish functionality
- July 07, 2025. Added authentication-protected admin routes with proper error handling
- July 07, 2025. Created all necessary UI components and connected admin panel to database
- July 08, 2025. Integrated AI content generation system with OpenAI GPT-4o for automated blog creation
- July 08, 2025. Added SEO optimization tools and product description automation
- July 08, 2025. Implemented comprehensive error handling for API quota management
- July 08, 2025. Added sample content templates for immediate use while setting up AI credits
- July 08, 2025. Successfully integrated and tested DeepSeek API for cost-effective AI content generation
- July 08, 2025. Confirmed 90% cost savings with DeepSeek while maintaining high-quality content output
- July 08, 2025. AI system tested and generating wellness content in 33 seconds through admin panel
- July 08, 2025. Created test endpoints and verified both DeepSeek and OpenAI provider switching functionality
- July 08, 2025. Implemented complete automated blog creation system with single and bulk creation capabilities
- July 08, 2025. Added beautiful admin UI for auto-creating blog posts from just title and category input
- July 08, 2025. Added bulk creation feature allowing up to 5 posts at once with intelligent provider selection
- July 08, 2025. Integrated auto-publish functionality for immediate content deployment or draft saving
- July 08, 2025. Enhanced landing page to perfectly showcase the freemium model with 60-day trial offer
- July 08, 2025. Implemented comprehensive Free vs Premium feature comparison with AI companion demo
- July 08, 2025. Created professional landing page sections: hero, features, blog samples, product picks
- July 08, 2025. Built responsive design emphasizing "Free Content Hub + Premium AI Companion" strategy
- July 08, 2025. Integrated comprehensive brand design system with tulsi leaf green primary color scheme
- July 08, 2025. Implemented clean, modern typography with professional sans-serif fonts for enhanced readability
- July 08, 2025. Updated entire platform to reflect minimalist design principles with improved color hierarchy
- July 08, 2025. Added wellness category images across navigation, landing page, and wellness picks sections
- July 08, 2025. Enhanced Revenue Optimization dashboard with real-time functionality and live data updates
- July 08, 2025. Implemented functional buttons with loading states, progress indicators, and API response handling
- July 08, 2025. Added automatic data refresh every 30 seconds with timestamp display for admin metrics
- July 08, 2025. Enhanced campaign management with realistic email metrics and conversion estimates
- July 08, 2025. Configured AI routing button with live DeepSeek optimization and cost-saving notifications