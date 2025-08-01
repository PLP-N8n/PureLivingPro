# Pure Living Pro - Wellness & Health Platform

## Overview
Pure Living Pro is a comprehensive full-stack web application designed as a wellness and health platform. It integrates AI-powered coaching, content management, e-commerce, and community features to offer a complete wellness journey. The platform provides personalized recommendations, premium content, meditation tools, and curated wellness products, aiming to be a complete solution for user well-being.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS with custom wellness color palette (sage and earth tones), using Radix UI components and shadcn/ui styling.
- **State Management**: TanStack Query
- **Routing**: Wouter
- **Animations**: Framer Motion

### Backend
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL with Drizzle ORM (Neon Database)
- **Authentication**: Replit Auth with OpenID Connect
- **Monorepo Structure**: `client/` (React), `server/` (Express.js), `shared/` (TypeScript schemas), `migrations/` (Database migrations).

### Core Features & Design Decisions
- **Authentication & User Management**: Replit Auth, session-based authentication, Stripe for premium subscriptions, user profiles with wellness preferences.
- **Content Management System**: Blog posts with premium gating, rich text support, category organization, SEO-friendly routing.
- **AI-Powered Wellness**: OpenAI (GPT-4o) for personalized plan generation, wellness quizzes, AI-generated recommendations, mood analysis. DeepSeek API is integrated for cost-effective AI content generation.
- **E-commerce & Product Management**: Curated wellness products, affiliate link management, categorization, wishlists.
- **Challenge System**: Community challenges, progress tracking, leaderboards, daily logging.
- **Premium Features**: Subscription-based access to premium content, advanced AI coaching, extended meditation library, expert consultation.
- **UI/UX Decisions**: Tulsi leaf green primary color, soft neutrals, and white for a minimalist, calm aesthetic. Clean, modern sans-serif fonts. Emphasis on white space, simple card layouts, and strong visual hierarchy.
- **Project Blueprint**: Detailed wireframe specifications for public, user, and admin pages including AI-powered coaching, premium subscriptions, and personalized recommendations.
- **Automated Affiliate Marketing & Content Creation**: Autonomous affiliate link scraping (Amazon, ClickBank, ShareASale), AI-powered content pipeline (DeepSeek, OpenAI), social media automation (X, Instagram, TikTok), and a central automation controller (MCP). Features intelligent URL scraping with AI product extraction and one-click "Auto-Fill" for product details.
- **Autonomous Controller**: Implements AI autonomy with zero-touch operation, intelligent scheduling, and real-time AI decision-making for self-optimization.
- **Advanced Analytics Dashboard**: Provides wellness-specific insights including user engagement, wellness metrics, content performance, revenue, challenge metrics, and predictive insights.

## External Dependencies

- **Neon Database**: Serverless PostgreSQL hosting.
- **OpenAI API**: AI-powered content generation and analysis.
- **DeepSeek API**: Cost-effective AI content generation.
- **Stripe**: Payment processing and subscription management.
- **SendGrid**: Email communications and notifications.
- **Replit Auth**: User authentication and session management.
- **Vite**: Frontend build tool.
- **Drizzle Kit**: Database migrations.
- **TypeScript**: Language used across the stack.
- **ESBuild**: Backend bundling.