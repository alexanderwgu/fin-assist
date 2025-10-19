import {
  type JobContext,
  type JobProcess,
  WorkerOptions,
  cli,
  defineAgent,
  metrics,
  voice,
  inference,
} from '@livekit/agents';
import * as livekit from '@livekit/agents-plugin-livekit';
import * as silero from '@livekit/agents-plugin-silero';
import { BackgroundVoiceCancellation } from '@livekit/noise-cancellation-node';
import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import { getPromptForMode, type SessionMode } from './prompts.js';
import { getToolsForMode } from './tools.js';

dotenv.config({ path: '.env.local' });

class Assistant extends voice.Agent {
  constructor(instructions: string, tools?: Record<string, unknown>) {
    super({
      instructions,
      // pass tools to the agent so LLM can call them
      tools: tools as any,

      // To add tools, specify `tools` in the constructor.
      // Here's an example that adds a simple weather tool.
      // You also have to add `import { llm } from '@livekit/agents' and `import { z } from 'zod'` to the top of this file
      // tools: {
      //   getWeather: llm.tool({
      //     description: `Use this tool to look up current weather information in the given location.
      //
      //     If the location is not supported by the weather service, the tool will indicate this. You must tell the user the location's weather is unavailable.`,
      //     parameters: z.object({
      //       location: z
      //         .string()
      //         .describe('The location to look up weather information for (e.g. city name)'),
      //     }),
      //     execute: async ({ location }) => {
      //       console.log(`Looking up weather for ${location}`);
      //
      //       return 'sunny with a temperature of 70 degrees.';
      //     },
      //   }),
      // },
    });
  }
}

export default defineAgent({
  prewarm: async (proc: JobProcess) => {
    proc.userData.vad = await silero.VAD.load();
  },
  entry: async (ctx: JobContext) => {
    // Set up a voice AI pipeline using OpenAI, Cartesia, AssemblyAI, and the LiveKit turn detector
    // Configure primary and fallback TTS providers
    const PRIMARY_TTS_MODEL = process.env.PRIMARY_TTS_MODEL || 'elevenlabs/eleven_turbo_v2';
    const PRIMARY_TTS_VOICE = process.env.PRIMARY_TTS_VOICE || '21m00Tcm4TlvDq8ikWAM';
    const FALLBACK_TTS_MODEL = process.env.FALLBACK_TTS_MODEL || 'cartesia/sonic-2';
    const FALLBACK_TTS_VOICE = process.env.FALLBACK_TTS_VOICE || undefined;

    const primaryTTS = new inference.TTS({
      model: PRIMARY_TTS_MODEL as any,
      voice: PRIMARY_TTS_VOICE,
    });

    const session = new voice.AgentSession({
      // Speech-to-text (STT) is your agent's ears, turning the user's speech into text that the LLM can understand
      // See all available models at https://docs.livekit.io/agents/models/stt/
      stt: 'assemblyai/universal-streaming:en',

      // A Large Language Model (LLM) is your agent's brain, processing user input and generating a response
      // See all providers at https://docs.livekit.io/agents/models/llm/
      llm: 'openai/gpt-4.1-mini',

      // Text-to-speech (TTS) is your agent's voice, turning the LLM's text into speech that the user can hear
      // See all available models as well as voice selections at https://docs.livekit.io/agents/models/tts/
      tts: primaryTTS,

      // VAD and turn detection are used to determine when the user is speaking and when the agent should respond
      // See more at https://docs.livekit.io/agents/build/turns
      turnDetection: new livekit.turnDetector.MultilingualModel(),
      vad: ctx.proc.userData.vad! as silero.VAD,
    });

    // To use a realtime model instead of a voice pipeline, use the following session setup instead.
    // (Note: This is for the OpenAI Realtime API. For other providers, see https://docs.livekit.io/agents/models/realtime/))
    // 1. Install '@livekit/agents-plugin-openai'
    // 2. Set OPENAI_API_KEY in .env.local
    // 3. Add import `import * as openai from '@livekit/agents-plugin-openai'` to the top of this file
    // 4. Use the following session setup instead of the version above
    // const session = new voice.AgentSession({
    //   llm: new openai.realtime.RealtimeModel({ voice: 'marin' }),
    // });

    // If the primary TTS encounters an error, switch to a fallback model for subsequent turns
    session.on(voice.AgentSessionEventTypes.Error, (ev) => {
      const isTTSError = typeof ev?.error === 'object' && ev?.error !== null && 'type' in (ev.error as any) && (ev.error as any).type === 'tts_error';
      const fromTTS = ev?.source && typeof ev.source === 'object' && 'label' in (ev.source as any);
      if (isTTSError || fromTTS) {
        try {
          if (FALLBACK_TTS_VOICE) {
            primaryTTS.updateOptions({
              model: FALLBACK_TTS_MODEL as any,
              voice: FALLBACK_TTS_VOICE,
            });
          } else {
            primaryTTS.updateOptions({
              model: FALLBACK_TTS_MODEL as any,
            });
          }
          console.warn('[TTS] Switched to fallback TTS model:', FALLBACK_TTS_MODEL);
        } catch (e) {
          console.error('Failed to switch to fallback TTS model', e);
        }
      }
    });

    // Metrics collection, to measure pipeline performance
    // For more information, see https://docs.livekit.io/agents/build/metrics/
    const usageCollector = new metrics.UsageCollector();
    session.on(voice.AgentSessionEventTypes.MetricsCollected, (ev) => {
      metrics.logMetrics(ev.metrics);
      usageCollector.collect(ev.metrics);
    });

    const logUsage = async () => {
      const summary = usageCollector.getSummary();
      console.log(`Usage: ${JSON.stringify(summary)}`);
    };

    ctx.addShutdownCallback(logUsage);

    // Join the room first so that room name/metadata are available for mode selection
    await ctx.connect();

    // Determine session mode from room name suffix (set by server), e.g., `_budgeting` or `_hotline`
    const roomName = ctx.room?.name ?? '';
    const modeFromRoom: SessionMode | undefined = roomName.endsWith('_budgeting')
      ? 'budgeting'
      : roomName.endsWith('_hotline')
        ? 'hotline'
        : undefined;

    const instructions = getPromptForMode(modeFromRoom);
    const tools = getToolsForMode(modeFromRoom as SessionMode | undefined, ctx.room as any);

    // Start the session, which initializes the voice pipeline and warms up the models
    await session.start({
      agent: new Assistant(instructions, tools),
      room: ctx.room,
      inputOptions: {
        // LiveKit Cloud enhanced noise cancellation
        // - If self-hosting, omit this parameter
        // - For telephony applications, use `BackgroundVoiceCancellationTelephony` for best results
        noiseCancellation: BackgroundVoiceCancellation(),
      },
    });
  },
});

cli.runApp(new WorkerOptions({ agent: fileURLToPath(import.meta.url) }));
