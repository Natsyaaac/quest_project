# Quest Gamification App

A daily quest/gamification application for students learning programming (JavaScript, PHP, CSS) with optional AI-powered quest generation.

## Features

- Daily programming quests for JavaScript, PHP, and CSS
- General life/productivity quests (exercise, reading, self-care)
- Points and achievement system
- Streak tracking
- AI-powered quest generation (optional, requires OpenAI API key)
- Fallback quest system when AI is unavailable

## Tech Stack

- **Frontend**: React, Vite, TailwindCSS, Shadcn/ui
- **Backend**: Express.js, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **AI**: OpenAI API (optional)

## Prerequisites

- Node.js 18+ (recommended: Node.js 20)
- npm or yarn
- PostgreSQL database (optional, app can run with in-memory storage)

## Local Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd rest-express
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
# Required for session management
SESSION_SECRET=your-random-secret-string-here

# Optional: PostgreSQL Database
DATABASE_URL=postgresql://user:password@localhost:5432/quests

# Optional: OpenAI API Key for AI-generated quests
# If not provided, the app will use fallback quests
OPENAI_API_KEY=sk-your-openai-api-key

# Optional: Set NODE_ENV
NODE_ENV=development
```

**Note**: The app works without `OPENAI_API_KEY` - it will use pre-defined fallback quests instead of AI-generated ones.

### 4. Database Setup (Optional)

If using PostgreSQL:

```bash
# Push schema to database
npm run db:push
```

### 5. Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5000`

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run check` | Run TypeScript type checking |
| `npm run db:push` | Push database schema changes |

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utilities and helpers
├── server/                 # Backend Express server
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Data storage layer
│   └── openai.ts          # OpenAI integration
├── shared/                 # Shared types and schemas
│   └── schema.ts          # Zod schemas and types
└── package.json
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/quests/daily` | Get today's quests |
| POST | `/api/quests/generate` | Generate new quests |
| POST | `/api/quests/:id/complete` | Mark quest as completed |
| GET | `/api/progress` | Get user progress |
| GET | `/api/achievements` | Get achievements |

## Quest Categories

- **JavaScript**: JS coding challenges
- **PHP**: PHP programming tasks
- **CSS**: Styling and layout exercises
- **General**: Life/productivity quests (exercise, reading, self-care, etc.)

## Troubleshooting

### "Missing OPENAI_API_KEY" warning
This is normal if you haven't set up OpenAI. The app will use fallback quests.

### Database connection errors
Make sure PostgreSQL is running and `DATABASE_URL` is correct. The app can also run with in-memory storage if no database is configured.

### Port 5000 already in use
Change the port by setting `PORT=3000` in your `.env` file.

## License

MIT
