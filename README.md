# 🎯 FinAssist - Modern Financial Assistant Monorepo

A comprehensive financial assistant platform combining a **LiveKit-powered voice agent backend** with a **modern React frontend** featuring financial literacy tools and crisis support.

## 📁 Project Structure

```
fin-assist/
├── agent-starter-node/          # LiveKit agent backend
│   ├── src/
│   │   ├── agent.ts           # Main agent logic
│   │   └── agent.test.ts      # Agent tests
│   ├── Dockerfile             # Container configuration
│   └── package.json           # Node.js dependencies
└── react-app/                 # CalmCall frontend application
    ├── app/                   # Next.js app directory
    │   ├── (app)/            # Main app pages
    │   ├── api/              # API routes
    │   ├── crisis-support/   # Crisis support pages
    │   ├── dashboard/        # Voice assistant dashboard
    │   ├── literacy/         # Financial literacy modules
    │   └── globals.css       # Global styles
    ├── components/           # React components
    │   ├── Cards/           # Card components
    │   ├── Layouts/         # Layout components
    │   ├── Navbar/          # Navigation components
    │   ├── Sidebar/         # Sidebar components
    │   └── VoiceInterface/  # Voice interaction components
    ├── lib/                 # Utility functions
    └── public/              # Static assets
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+
- **pnpm** package manager
- **LiveKit Server** (for voice agent functionality)

### Installation

```bash
# Install all dependencies
pnpm install:all

# Or install individually
pnpm install:react    # Frontend dependencies
pnpm install:agent    # Backend dependencies
```

### Development

```bash
# Start the React frontend
pnpm dev

# Start the agent backend (in another terminal)
pnpm agent:dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## 🎨 Frontend Features (CalmCall)

### ✨ Modern Design System
- **Vision UI Color Palette**: Professional gradients and colors
- **Typography**: Plus Jakarta Display + Inter fonts
- **Component System**: Modern cards, buttons, and layouts
- **Responsive**: Mobile-first design approach

### 🎯 Core Features

#### 1. **Voice Assistant** (`/dashboard`)
- Large gradient microphone with pulse animation
- Real-time transcription display
- AI-powered financial responses
- Audio playback with custom styling

#### 2. **Financial Literacy** (`/literacy`)
- 6 comprehensive learning modules
- Card-based layout with hover effects
- Progress tracking dashboard
- Interactive learning experience

#### 3. **Crisis Support** (`/crisis-support`)
- Emergency hotlines with contact buttons
- Grounding techniques with step-by-step guides
- Self-care reminders and resources
- Compassionate, supportive messaging

#### 4. **Modern Navigation**
- Gradient sidebar with active states
- Mobile-responsive hamburger menu
- Support section with action buttons

## 🤖 Backend Features (Agent)

- **LiveKit Integration**: Real-time voice communication
- **TypeScript**: Fully typed agent implementation
- **Docker Support**: Containerized deployment
- **Testing**: Comprehensive test suite

## 🛠️ Technical Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4 + Custom CSS
- **UI Components**: Vision UI Design System
- **Icons**: Font Awesome 6.6+
- **Voice Processing**: LiveKit Components
- **Validation**: Zod

### Backend
- **Runtime**: Node.js
- **Language**: TypeScript
- **Voice Agent**: LiveKit Agents
- **Container**: Docker
- **Testing**: Jest

## 🔧 Configuration

### Environment Variables

Create `.env.local` in the `react-app` directory:

```env
# LiveKit Configuration
LIVEKIT_API_KEY=your_livekit_api_key
LIVEKIT_API_SECRET=your_livekit_api_secret
LIVEKIT_URL=https://your-livekit-server-url

# AI Services (Optional)
ELEVENLABS_VOICE_ID=your_elevenlabs_voice_id
GOOGLE_API_KEY=your_google_api_key
OPENAI_API_KEY=your_openai_api_key
```

## 📦 Deployment

### Frontend
```bash
cd react-app
pnpm build
pnpm start
```

### Backend
```bash
cd agent-starter-node
docker build -t finassist-agent .
docker run -p 7880:7880 finassist-agent
```

## 🔒 Security

- [x] API validation with Zod
- [x] Environment variables for secrets
- [x] Error boundaries and fallback UIs
- [x] CORS protection
- [x] Rate limiting ready

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - See individual package licenses for details.

## 📞 Support

- 📧 Email: support@calmcall.app
- 💬 Discord: [Join Community](https://discord.gg/calmcall)
- 🐛 Issues: [GitHub Issues](https://github.com/your-repo/issues)

---

**Built with ❤️ for compassionate financial assistance**