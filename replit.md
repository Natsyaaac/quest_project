# My Programming Journey - Learning Dashboard

## Overview

A gamified personal programming learning dashboard that helps users learn JavaScript, PHP, and CSS through daily quests, achievements, and progress tracking. The application combines elements from gamified learning platforms (like Duolingo) with productivity tools to create an engaging, motivational learning experience.

The dashboard features AI-generated daily programming quests, a comprehensive achievement system, learning resource links, progress statistics with streaks, and local data persistence with import/export capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state, React useState for local state
- **Styling**: Tailwind CSS with CSS custom properties for theming (light/dark mode support)
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Build Tool**: Vite with React plugin

The frontend follows a component-based architecture with:
- Pages in `client/src/pages/` (Home, NotFound)
- Feature components in `client/src/components/` (DailyQuests, Achievements, ScoreDisplay, etc.)
- Reusable UI primitives in `client/src/components/ui/`
- Custom hooks in `client/src/hooks/`
- Utility functions and storage in `client/src/lib/`

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **HTTP Server**: Node.js http module wrapping Express
- **API Structure**: RESTful endpoints under `/api/` prefix
- **Development**: Vite dev server middleware for HMR
- **Production**: Static file serving from built assets

Key backend patterns:
- Route registration in `server/routes.ts`
- OpenAI integration in `server/openai.ts` for quest generation
- In-memory storage abstraction in `server/storage.ts`
- Environment-aware static serving (dev vs production)

### Data Storage
- **Client-side**: localStorage for user progress, completed quests, and achievements
- **Server-side**: In-memory storage (MemStorage class) for user data
- **Database Schema**: Drizzle ORM configured with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` using Zod for validation

Data persistence strategy:
- User progress (scores, streaks, achievements) stored in localStorage
- Daily quests cached in localStorage with date-based invalidation
- Export/import functionality for data backup via Excel files (.xlsx format)
- Monthly achievement reset system (resets on 1st of each month)

### API Endpoints
- `GET /api/quests/daily` - Fetch cached or generate new daily quests
- `POST /api/quests/generate` - Force generation of new quests via OpenAI

### Key Design Decisions

**Gamification System**: Points-based progression with difficulty tiers (easy/medium/hard), streak tracking for daily engagement, and tiered achievements based on quest completion milestones.

**Hybrid Storage**: Client-side localStorage handles the majority of state persistence, reducing server complexity while maintaining data across sessions. The server primarily handles AI-powered quest generation.

**Component Library**: shadcn/ui chosen for its unstyled, accessible Radix UI foundation that allows full styling control via Tailwind CSS while maintaining WCAG compliance.

**AI Quest Generation**: OpenAI GPT-5 generates contextual challenges including both programming quests (JavaScript, PHP, CSS) and general life/productivity quests (exercise, reading, self-care). The app includes a robust fallback system with pre-defined quests when OpenAI is unavailable.

**Quest Categories**: 
- Programming: JavaScript, PHP, CSS coding challenges
- General: Life/productivity quests (hydration, stretching, reading, organization, mindfulness)

## External Dependencies

### AI Services
- **OpenAI API**: GPT-5 model for generating daily programming quests
- Requires `OPENAI_API_KEY` environment variable

### Database
- **PostgreSQL**: Configured via Drizzle ORM
- Requires `DATABASE_URL` environment variable
- Schema migrations in `./migrations` directory

### Third-Party Libraries
- **@tanstack/react-query**: Server state management and caching
- **Radix UI**: Accessible component primitives (dialog, dropdown, toast, etc.)
- **Drizzle ORM**: TypeScript-first database toolkit
- **Zod**: Runtime schema validation
- **date-fns**: Date manipulation utilities
- **Lucide React**: Icon library

### Development Tools
- **Vite**: Frontend build tool with HMR
- **esbuild**: Server bundling for production
- **Replit plugins**: Dev banner, cartographer, runtime error overlay