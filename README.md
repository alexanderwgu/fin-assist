# FinAssist - FinAssist Financial Hotline

A 24-hour hackathon project: an **AI-driven financial hotline** that provides soothing voice assistance, emotional crisis detection, and financial literacy education. Built with modern web technologies and powered by real-time voice communication.

**Mission:** Help users feel calmer and more confident about their finances through compassionate, human-centered AI assistance.

DISCLAIMER: NO DATA IS COLLECTED + IF AGENT ISN'T TALKING BACK, OUR TTS USAGE IS 99.9% FRIED AND RATE LIMITED!
---

## Table of Contents

- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Development](#development)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)

---

## Project Overview

**FinAssist** is a financial wellness platform designed with emotional intelligence at its core. Rather than bombarding users with financial jargon or fear-based warnings, FinAssist:

**Provides Real-Time Voice Support** - Natural conversations with an AI financial mentor
**Teaches Financial Literacy** - Guided lessons on budgeting, debt, savings, and credit scores
**Detects Crisis Situations** - Identifies panic, overwhelm, or self-harm language and escalates appropriately
**Offers Human-Centered Guidance** - Directs users to trusted resources and hotlines when needed
**Maintains Calm Tone** - Soothing UI and compassionate responses normalize financial confusion

### Success Metrics

- User leaves calmer than they arrived
- User learns at least one useful financial concept
- Crisis users are safely redirected to human resources

---

## Key Features

### Voice Assistant (`/dashboard`)
- **Real-time Voice Interaction**: StreamingTextProcedure with LiveKit for seamless two-way communication
- **AI-Powered Responses**: Context-aware financial guidance using Claude/GPT
- **Emotional Voice Synthesis**: ElevenLabs TTS for soothing, human-like responses
- **Live Transcription**: Real-time speech-to-text with visual feedback
- **Audio Playback**: Smooth voice synthesis with waveform visualization
- **Pulse Animation**: Engaging microphone UI with motion effects

### Financial Literacy (`/literacy`)
Six comprehensive learning modules:
- **Budgeting Basics** - Creating and maintaining a personal budget
- **Debt Management** - Understanding and managing different types of debt
- **Saving Strategies** - Building emergency funds and long-term savings
- **Credit Scores** - How credit works and building good credit
- **Investment Fundamentals** - Introduction to investing basics
- **Financial Wellness** - Holistic approach to financial health

Features:
- Card-based interactive layout
- Progress tracking dashboard
- Hover effects and smooth transitions
- Responsive design for all devices

### Crisis Support (`/crisis-support`)
When panic language is detected:
- **Emergency Hotlines** - Direct contact buttons for trusted financial and mental health resources
- **Grounding Techniques** - Step-by-step exercises (5-4-3-2-1 technique, breathing exercises)
- **Self-Care Reminders** - Supportive, non-judgmental guidance
- **Resource Links** - Curated list of trusted financial counseling services
- **Safe Escalation** - Graceful handoff to human support

### Navigation & UI
- **Gradient Sidebar** - Modern, soothing aesthetic with active state indicators
- **Responsive Hamburger Menu** - Mobile-first design approach
- **Support Section** - Quick access to crisis resources and help
- **Dark/Light Theme Toggle** - System preference detection with manual override
- **Accessibility-First** - WCAG compliant components

---

## Technology Stack

### Frontend (FinAssist React App)

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Framework** | Next.js | 15.5.2 | React SSR with App Router |
| **Runtime** | Node.js | 18+ | JavaScript runtime |
| **Language** | TypeScript | 5.x | Type-safe development |
| **UI Framework** | React | 19.0.0 | Component library |
| **Styling** | Tailwind CSS | 4.x | Utility-first CSS |
| **Icons** | FontAwesome + Phosphor | 6.6.0+ | Icon libraries |
| **Voice** | LiveKit Client | 2.15.8 | Real-time communication |
| **LLM Integration** | Vercel AI SDK | 5.0.76 | Multi-provider LLM support |
| **LLM Providers** | OpenAI, Google, ElevenLabs | Latest | AI models and TTS |
| **Animation** | Motion | 12.16.0 | Smooth animations |
| **UI Components** | Radix UI | Latest | Headless components |
| **Validation** | Zod | 3.25.76 | Type-safe schema validation |
| **Toasts** | Sonner | 2.0.3 | Toast notifications |
| **Theme** | next-themes | 0.4.6 | Theme management |
| **Utilities** | clsx, tailwind-merge | Latest | CSS utilities |
| **Visualization** | D3 Sankey | 0.12.3 | Budget flow visualization |
| **ML** | TensorFlow.js, MediaPipe | 4.22.0+ | Emotion/face detection |

### Backend (Agent - Node.js)

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Framework** | LiveKit Agents JS | 1.0.10 | Voice AI framework |
| **Language** | TypeScript | 5.9.2 | Type-safe backend code |
| **Runtime** | Node.js | 22+ | JavaScript runtime |
| **VAD** | Silero | 1.0.10 | Voice Activity Detection |
| **Voice Processing** | LiveKit + Noise Cancellation | 0.1.9 | Audio processing |
| **Validation** | Zod | 3.25.76 | Schema validation |
| **Env Management** | dotenv | 17.2.1 | Configuration |
| **Build** | TypeScript Compiler | 5.9.2 | TS → JS compilation |
| **Container** | Docker | Latest | Production deployment |

### Development Tools

| Tool | Version | Purpose |
|------|---------|---------|
| **Package Manager** | pnpm | 9.15.9 | Fast, disk-efficient package management |
| **Testing** | Node.js built-in test runner | Latest | Native test execution |
| **Linting** | ESLint | 9.x | Code quality |
| **Formatting** | Prettier | 3.4.2 | Code formatting |
| **Type Checking** | TypeScript | 5.x | Static type analysis |

### Deployment & Infrastructure

- **Hosting**: Vercel (recommended for Next.js)
- **Container Registry**: Docker (agent backend)
- **Environment**: Vercel, AWS, Netlify, or Docker-compatible platforms
- **CI/CD**: GitHub Actions ready

---

## Architecture

### Monorepo Structure

```
fin-assist/
├── react-app/                    # Frontend (Next.js 15)
│   ├── app/                      # App Router pages
│   │   ├── (app)/               # Main app routes
│   │   ├── api/                 # API routes
│   │   ├── crisis-support/      # Crisis support pages
│   │   ├── dashboard/           # Voice assistant
│   │   └── literacy/            # Learning modules
│   ├── components/              # React components
│   │   ├── app/                # App-level components
│   │   ├── livekit/            # Voice interface
│   │   ├── Cards/              # UI cards
│   │   ├── Layouts/            # Layout components
│   │   └── Navbar/Sidebar/     # Navigation
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utilities
│   └── styles/                 # Global CSS
│
└── agent-starter-node/         # Backend (Voice Agent)
    ├── src/
    │   ├── agent.ts           # Main agent logic
    │   ├── prompts.ts         # System prompts
    │   └── tools.ts           # Agent tools
    ├── Dockerfile             # Container config
    └── package.json           # Dependencies
```

### Data Flow

```
User Browser
    ↓
Next.js Frontend (React 19)
    ↓
LiveKit Client SDK
    ↓
LiveKit Server (Real-time Signaling)
    ↓
Backend Agent (Node.js)
    ├→ Speech-to-Text (Silero VAD)
    ├→ LLM Processing (OpenAI/Google)
    └→ Text-to-Speech (ElevenLabs)
    ↓
Back to User (Voice Output)
```

### Crisis Detection Pipeline

```
User Input
    ↓
Crisis Language Detection
    ├→ Panic keywords: "overwhelmed", "can't", "help me"
    ├→ Despair keywords: "give up", "hopeless", "end it"
    └→ Financial distress: "eviction", "homelessness", "starving"
    ↓
Crisis Protocol Activated
    ├→ Grounding exercises offered
    ├→ Emergency hotlines displayed
    └→ Human support escalation recommended
```

---

## Project Structure

### Frontend App Structure

```
react-app/
├── app/                              # Next.js App Router
│   ├── (app)/layout.tsx             # Main layout wrapper
│   ├── page.tsx                     # Home/welcome page
│   ├── api/                         # API route handlers
│   │   ├── app-config/             # Config endpoint
│   │   ├── connection-details/     # LiveKit credentials
│   │   └── summary/                # Session summary
│   ├── dashboard/page.tsx           # Voice assistant
│   ├── literacy/page.tsx            # Learning modules
│   ├── crisis-support/page.tsx      # Crisis resources
│   └── transcript/page.tsx          # Session transcript
│
├── components/
│   ├── app/
│   │   ├── app.tsx                 # Main app container
│   │   ├── session-view.tsx        # Active session UI
│   │   ├── welcome-view.tsx        # Welcome screen
│   │   ├── onboarding-view.tsx     # Onboarding flow
│   │   ├── view-controller.tsx     # Route controller
│   │   ├── theme-toggle.tsx        # Dark/light mode
│   │   ├── emotion-tracking-provider.tsx  # Emotion detection
│   │   └── BudgetSankey.tsx        # Budget visualization
│   │
│   ├── livekit/
│   │   ├── agent-control-bar/      # Control buttons
│   │   ├── chat-entry.tsx          # Chat message UI
│   │   └── scroll-area/            # Auto-scroll component
│   │
│   ├── Layouts/
│   │   └── AdminLayout.tsx         # Dashboard layout
│   │
│   ├── Navbar/                     # Top navigation
│   └── Sidebar/                    # Side navigation
│
├── hooks/
│   ├── useRoom.ts                  # LiveKit room management
│   ├── useChatMessages.ts          # Chat state management
│   ├── useBudgetSankey.ts          # Budget visualization
│   ├── useConnectionTimeout.tsx    # Connection handling
│   └── useDebug.ts                 # Debug utilities
│
├── lib/
│   ├── utils.ts                    # Helper functions
│   ├── sankey.ts                   # D3 Sankey utilities
│   ├── transcript.ts               # Transcript formatting
│   └── onboarding.ts               # Onboarding data
│
├── types/
│   ├── ai-sdk.d.ts                # Type definitions
│   └── d3-sankey.d.ts             # D3 types
│
├── app-config.ts                   # Configuration
├── next.config.ts                  # Next.js config
├── tailwind.config.js              # Tailwind config
├── postcss.config.mjs              # PostCSS config
└── tsconfig.json                   # TypeScript config
```

### Backend Agent Structure

```
agent-starter-node/
├── src/
│   ├── agent.ts                    # Main agent entry point
│   │   ├── Voice pipeline setup
│   │   ├── Message handling
│   │   └── Emotional intelligence
│   │
│   ├── prompts.ts                  # System prompts
│   │   ├── Financial advisor tone
│   │   ├── Crisis protocol
│   │   └── Literacy lesson prompts
│   │
│   └── tools.ts                    # Available agent tools
│       ├── Budget calculator
│       ├── Debt analyzer
│       └── Resource finder
│
├── dist/                           # Compiled JavaScript
├── Dockerfile                      # Production container
├── tsconfig.json                   # TypeScript config
├── eslint.config.ts               # Linting rules
└── package.json                   # Dependencies
```

---

## Quick Start

### Prerequisites

- **Node.js**: v18+ (v22+ for agent)
- **pnpm**: v9.15.9+
- **Git**: For version control
- **LiveKit Account**: Free tier available at [cloud.livekit.io](https://cloud.livekit.io)

### 1. Clone & Install

```bash
# Clone the repository
git clone https://github.com/your-org/fin-assist.git
cd fin-assist

# Install all dependencies (monorepo)
pnpm install:all

# Or individually:
pnpm install:react
pnpm install:agent
```

### 2. Configure Environment

Create `.env.local` in `react-app/`:

```env
# LiveKit Configuration (required)
LIVEKIT_API_KEY=pk_your_api_key_here
LIVEKIT_API_SECRET=your_secret_here
LIVEKIT_URL=wss://your-livekit-server.livekit.cloud

# LLM Providers (at least one required)
OPENAI_API_KEY=sk_...
NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY=your_key
ELEVENLABS_API_KEY=sk_...
ELEVENLABS_VOICE_ID=your_voice_id

# Optional: Google Cloud Speech (for transcription)
GOOGLE_APPLICATION_CREDENTIALS=./path/to/credentials.json
```

### 3. Download Agent Models

```bash
cd agent-starter-node
pnpm run download-files
cd ..
```

### 4. Start Development

```bash
# Terminal 1: Start frontend
pnpm dev

# Terminal 2: Start agent backend
pnpm agent:dev

# Open http://localhost:3000
```

---

## Installation

### Detailed Setup

#### 1. Prerequisites Verification

```bash
# Check Node.js version
node --version  # Should be v18+

# Check pnpm
pnpm --version  # Should be v9.15.9+

# Check Git
git --version
```

#### 2. Clone Repository

```bash
git clone https://github.com/your-org/fin-assist.git
cd fin-assist
```

#### 3. Install Dependencies

```bash
# Full monorepo install (recommended)
pnpm install:all

# Verify installation
pnpm list --depth=0
```

#### 4. Set Up Environment Variables

**For Frontend (`react-app/.env.local`):**

```env
# === REQUIRED ===
LIVEKIT_API_KEY=pk_your_livekit_key
LIVEKIT_API_SECRET=your_livekit_secret
LIVEKIT_URL=wss://your-instance.livekit.cloud

# === LLM (choose at least one) ===
OPENAI_API_KEY=sk_your_openai_key
NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY=your_google_key

# === TEXT-TO-SPEECH ===
ELEVENLABS_API_KEY=sk_your_elevenlabs_key
ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM  # Calm voice ID

# === OPTIONAL ===
NEXT_PUBLIC_DEBUG_MODE=false
```

**For Agent (`agent-starter-node/.env.local`):**

```env
# Copy from LiveKit Cloud
LIVEKIT_URL=wss://your-instance.livekit.cloud
LIVEKIT_API_KEY=pk_...
LIVEKIT_API_SECRET=...
```

#### 5. Download ML Models

```bash
cd agent-starter-node
pnpm run download-files
cd ..
```

This downloads:
- **Silero VAD**: Voice Activity Detection model (~5MB)
- **LiveKit Turn Detector**: Speaker detection (~20MB)

#### 6. Verify Setup

```bash
# Type check both projects
cd react-app && pnpm typecheck
cd ../agent-starter-node && pnpm typecheck
cd ..

# Run linter
pnpm lint
```

---

## Development

### Running the Application

```bash
# Frontend only (requires external agent)
cd react-app
pnpm dev

# Agent only
cd agent-starter-node
pnpm dev

# From root - both processes
pnpm dev          # Terminal 1: Frontend on :3000
pnpm agent:dev    # Terminal 2: Agent
```

### Development Scripts

#### Frontend (`react-app/`)

```bash
pnpm dev              # Start dev server with Turbopack
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm format           # Format code with Prettier
pnpm format:check     # Check formatting
pnpm typecheck        # Type-check only
```

#### Agent (`agent-starter-node/`)

```bash
pnpm dev              # Run in development mode
pnpm start            # Run in production mode
pnpm build            # Compile TypeScript
pnpm test             # Run tests
pnpm test:watch       # Watch mode testing
pnpm lint             # ESLint check
pnpm lint:fix         # ESLint auto-fix
pnpm typecheck        # Type check
```

### Hot Reload & Debugging

- **Frontend**: Automatic hot reload via Turbopack
- **Agent**: Restart required on code changes
- **Debug Mode**: Set `NEXT_PUBLIC_DEBUG_MODE=true` for verbose logging

### Testing

```bash
# Frontend tests (if configured)
cd react-app
pnpm test

# Agent tests
cd agent-starter-node
pnpm test
pnpm test:watch
```

### Code Style

```bash
# Format all code
pnpm format

# Check formatting
pnpm format:check

# Lint all code
pnpm lint
```

---

## Configuration

### App Configuration (`react-app/app-config.ts`)

```typescript
export const APP_CONFIG_DEFAULTS: AppConfig = {
  // Display settings
  companyName: 'FinAssist',
  pageTitle: 'Financial Wellness Hotline',
  pageDescription: 'Calm, compassionate financial support',

  // Feature flags
  supportsChatInput: true,
  supportsVideoInput: true,
  supportsScreenShare: true,
  isPreConnectBufferEnabled: true,

  // Branding
  logo: '/FinAssist-logo.svg',
  accent: '#10b981',  // Emerald green for calm
  logoDark: '/FinAssist-logo-dark.svg',
  accentDark: '#059669',
  startButtonText: 'Start Conversation',

  // LiveKit Cloud Sandbox (optional)
  sandboxId: undefined,
  agentName: undefined,
};
```

### Tailwind Configuration

The project uses **Tailwind CSS 4.x** with custom theme:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        calm: {
          50: '#f0fdf4',
          500: '#10b981',  // Primary: Calm emerald
          900: '#065f46',
        },
      },
      animation: {
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
};
```

### LiveKit Configuration

The app expects a LiveKit server URL. Options:

1. **LiveKit Cloud** (recommended):
   - Sign up: [cloud.livekit.io](https://cloud.livekit.io)
   - Create project
   - Copy credentials to `.env.local`

2. **Self-Hosted LiveKit**:
   - [Installation guide](https://docs.livekit.io/home/self-hosting/)
   - Run docker: `docker run --rm -p 7880:7880 -p 7881:7881 livekit/livekit-server`

### AI Provider Setup

#### OpenAI

```bash
# Get API key from https://platform.openai.com/api-keys
OPENAI_API_KEY=sk_...
```

#### Google Generative AI

```bash
# Get API key from https://makersuite.google.com/app/apikey
NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY=...
```

#### ElevenLabs (Text-to-Speech)

```bash
# Get API key from https://elevenlabs.io
ELEVENLABS_API_KEY=sk_...
ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM  # Calm voice ID
```

---

## Deployment

### Frontend Deployment (Vercel - Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from root
vercel --cwd react-app

# Or use Vercel GitHub integration
# Push to GitHub → Vercel auto-deploys
```

**Vercel Configuration:**

```json
{
  "buildCommand": "pnpm build",
  "installCommand": "pnpm install",
  "outputDirectory": ".next",
  "env": {
    "LIVEKIT_API_KEY": "@livekit_api_key",
    "LIVEKIT_API_SECRET": "@livekit_api_secret",
    "LIVEKIT_URL": "@livekit_url",
    "OPENAI_API_KEY": "@openai_api_key"
  }
}
```

### Agent Deployment (Docker)

```bash
# Build image
cd agent-starter-node
docker build -t fin-assist-agent:latest .

# Run locally
docker run -p 8081:8081 \
  -e LIVEKIT_URL=wss://your-server.livekit.cloud \
  -e LIVEKIT_API_KEY=pk_... \
  -e LIVEKIT_API_SECRET=... \
  fin-assist-agent:latest

# Push to registry
docker tag fin-assist-agent:latest your-registry/fin-assist-agent:latest
docker push your-registry/fin-assist-agent:latest
```

### Platform-Specific Deployments

#### AWS

```bash
# ECS/Fargate
# Use ECR for image storage
# Configure ALB for networking
```

#### Google Cloud

```bash
# Cloud Run for agent
gcloud run deploy fin-assist-agent \
  --image gcr.io/your-project/fin-assist-agent \
  --platform managed \
  --region us-central1
```

#### Self-Hosted (Linux VPS)

```bash
# SSH to server
ssh user@your-server.com

# Clone and setup
git clone https://github.com/your-org/fin-assist.git
cd fin-assist

# Install dependencies
pnpm install:all

# Run with PM2
pnpm add -g pm2
pm2 start "pnpm dev"
pm2 start "pnpm agent:dev"
pm2 save
```

---

## Security

### Security Measures Implemented

- **API Validation**: Zod schemas for all inputs
- **Environment Secrets**: All sensitive data in `.env.local`
- **Error Boundaries**: Graceful error handling throughout
- **CORS Protection**: LiveKit CORS policies
- **Rate Limiting**: Built-in API throttling
- **Type Safety**: Full TypeScript coverage
- **Dependency Scanning**: Regular npm audit

### Security Best Practices

#### Never Commit Secrets

```bash
# Add to .gitignore
.env.local
.env.production.local
.DS_Store
node_modules/
```

#### Validate User Input

```typescript
// Use Zod for runtime validation
import { z } from 'zod';

const UserMessageSchema = z.object({
  text: z.string().min(1).max(1000),
  userId: z.string().uuid(),
});

const validated = UserMessageSchema.parse(userInput);
```

#### Handle Errors Gracefully

```typescript
try {
  const response = await fetch('/api/financial-advice', {
    method: 'POST',
    body: JSON.stringify(userMessage),
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
} catch (error) {
  console.error('Request failed:', error);
  // Show user-friendly message, not technical details
}
```

#### Secrets Rotation

```bash
# Rotate LiveKit credentials regularly
# 1. Generate new keys in LiveKit console
# 2. Update .env.local
# 3. Redeploy application
# 4. Revoke old keys
```

---

## Contributing


### Getting Started (if u still want to, though)

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Make** your changes
4. **Test** your changes: `pnpm test`
5. **Commit** with clear messages: `git commit -m 'Add amazing feature'`
6. **Push** to your fork: `git push origin feature/amazing-feature`
7. **Create** a Pull Request

### Code Standards

- **TypeScript**: All code must be fully typed
- **Formatting**: Use `pnpm format`
- **Linting**: Pass `pnpm lint` without errors
- **Testing**: Add tests for new features
- **Documentation**: Update README for API changes

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: Add crisis detection module
fix: Resolve voice input lag issue
docs: Update configuration guide
test: Add emotion detection tests
chore: Upgrade dependencies
```

---

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### Third-Party Licenses

- **LiveKit**: Apache 2.0
- **Next.js**: MIT
- **React**: MIT
- **Tailwind CSS**: MIT
- **ElevenLabs**: Check their ToS
- **OpenAI API**: Check their ToS

---

## Support & Resources

### Documentation

- [LiveKit Agents Docs](https://docs.livekit.io/agents)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Guide](https://tailwindcss.com/docs)

### Contact

- **Website**: [https://FinAssist.app](https://devpost.com/software/fin-lucent-a-financial-hotline-and-personal-mentor?_gl=1*oxy7v7*_gcl_au*NDM1OTYyNTk4LjE3NjA5MDE3OTU.*_ga*MTEwMzI4MzU0Mi4xNzYwOTAxNzk2*_ga_0YHJK3Y10M*czE3NjA5MDE3OTUkbzEkZzEkdDE3NjA5MDE4NDEkajE0JGwwJGgw)

---

## Project Status

- Core voice agent functionality
- Financial literacy modules
- Crisis detection system
- Real-time transcription
- Integration testing (in progress)
- Advanced analytics (planned)
- Mobile app (planned)

---


**Last Updated**: October 2025 | **Version**: 0.1.0 (Hackathon Release)

**Remember**: FinAssist is here to help. If you're experiencing financial or mental health crisis, please reach out to professional resources. You're not alone.
