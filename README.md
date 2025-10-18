This repo now uses LiveKit example projects for both the frontend and agent.

## Environment

- Single env file at repo root: `.env.local`
- Required keys:
  - LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET
  - NEXT_PUBLIC_AGENT_NAME (e.g. calmcall-voice-agent)
  - Optional: NEXT_PUBLIC_LIVEKIT_URL (frontend only; defaults to LIVEKIT_URL)

## Frontend (finassist-agent)

- Source: `finassist-agent` cloned from [agent-starter-react](https://github.com/livekit-examples/agent-starter-react)
- Loads env from repo root via `next.config.ts`
- Run:
  - `pnpm agent` (or `pnpm --filter ./finassist-agent dev`)

## Agent (agent-starter-node)

- Source: `agent-starter-node` cloned from [agent-starter-node](https://github.com/livekit-examples/agent-starter-node)
- Loads env from repo root in `src/agent.ts`
- First time only: `pnpm --filter ./agent-starter-node download-files`
- Run agent: `pnpm --filter ./agent-starter-node dev`

## Run both

```bash
pnpm agent:up
```

Docs: [Voice AI quickstart](https://docs.livekit.io/agents/start/voice-ai/)
