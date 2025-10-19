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
    });
  }
}

export default defineAgent({
  prewarm: async (proc: JobProcess) => {
    proc.userData.vad = await silero.VAD.load();
  },
  entry: async (ctx: JobContext) => {
    // Set up a voice AI pipeline using Google Gemini, Cartesia, AssemblyAI, and the LiveKit turn detector
    // Configure primary and fallback TTS providers
    const PRIMARY_TTS_MODEL = process.env.PRIMARY_TTS_MODEL || 'elevenlabs/eleven_turbo_v2';
    const PRIMARY_TTS_VOICE = process.env.PRIMARY_TTS_VOICE || '21m00Tcm4TlvDq8ikWAM';
    const FALLBACK_TTS_MODEL = process.env.FALLBACK_TTS_MODEL || 'cartesia/sonic-2';
    const FALLBACK_TTS_VOICE = process.env.FALLBACK_TTS_VOICE || undefined;
    // Configure primary and fallback STT providers
    const PRIMARY_STT_MODEL = process.env.PRIMARY_STT_MODEL || 'assemblyai/universal-streaming';
    const FALLBACK_STT_MODEL = process.env.FALLBACK_STT_MODEL || 'deepgram/nova-3';
    const STT_LANGUAGE = process.env.STT_LANGUAGE || 'en';

    const primaryTTS = new inference.TTS({
      model: PRIMARY_TTS_MODEL as any,
      voice: PRIMARY_TTS_VOICE,
    });

    // Instantiate STT explicitly so we can swap models on errors
    const primarySTT = new inference.STT({
      model: PRIMARY_STT_MODEL as any,
      language: STT_LANGUAGE as any,
    });

    const session = new voice.AgentSession({
      // Speech-to-text (STT) is your agent's ears, turning the user's speech into text that the LLM can understand
      // See all available models at https://docs.livekit.io/agents/models/stt/
      stt: primarySTT,

      // A Large Language Model (LLM) is your agent's brain, processing user input and generating a response
      // See all providers at https://docs.livekit.io/agents/models/llm/
      llm: 'google/gemini-2.5-flash',

      // Text-to-speech (TTS) is your agent's voice, turning the LLM's text into speech that the user can hear
      // See all available models as well as voice selections at https://docs.livekit.io/agents/models/tts/
      tts: primaryTTS,

      // VAD and turn detection are used to determine when the user is speaking and when the agent should respond
      // See more at https://docs.livekit.io/agents/build/turns
      turnDetection: new livekit.turnDetector.MultilingualModel(),
      vad: ctx.proc.userData.vad! as silero.VAD,
    });

    // On error events, switch only the relevant subsystem (TTS vs STT)
    let ttsUsingFallback = false;
    let sttUsingFallback = false;
    session.on(voice.AgentSessionEventTypes.Error, (ev) => {
      const sourceLabel = (ev?.source as any)?.label as string | undefined;

      // TTS fallback: only when the error came from TTS
      if (sourceLabel === 'inference.TTS' && !ttsUsingFallback) {
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
          ttsUsingFallback = true;
          console.warn('[TTS] Switched to fallback TTS model:', FALLBACK_TTS_MODEL);
        } catch (e) {
          console.error('Failed to switch to fallback TTS model', e);
        }
        return;
      }

      // STT fallback: only when the error came from STT
      if (sourceLabel === 'inference.STT' && !sttUsingFallback) {
        try {
          primarySTT.updateOptions({
            model: FALLBACK_STT_MODEL as any,
            // keep language unchanged unless explicitly overridden via env
            language: STT_LANGUAGE as any,
          });
          sttUsingFallback = true;
          console.warn('[STT] Switched to fallback STT model:', FALLBACK_STT_MODEL);
        } catch (e) {
          console.error('Failed to switch to fallback STT model', e);
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

    // Track emotion updates from the client's MediaPipe detector
    let latestEmotion: { label: string; confidence: number; at: number } | null = null;
    const room = ctx.room as any;
    room.on('dataReceived', (data: any) => {
      try {
        const str = new TextDecoder().decode(data.data);
        const payload = JSON.parse(str);
        if (payload.type === 'emotion_update' && payload.sentiment) {
          latestEmotion = { ...payload.sentiment, at: payload.at };
          console.log(`[Emotion] Detected ${payload.sentiment.label} (confidence: ${payload.sentiment.confidence.toFixed(2)})`);
        }
      } catch {
        // Ignore parsing errors
      }
    });

    // Determine session mode from room name suffix (set by server), e.g., `_budgeting` or `_hotline`
    const roomName = ctx.room?.name ?? '';
    const modeFromRoom: SessionMode | undefined = roomName.endsWith('_budgeting')
      ? 'budgeting'
      : roomName.endsWith('_hotline')
        ? 'hotline'
        : undefined;

    let emotionAwareInstructions = getPromptForMode(modeFromRoom);
    // Enhance the system instructions with emotion awareness capability
    emotionAwareInstructions += `

## Facial Expression & Emotion Tracking (Optional)

If the user has enabled emotion tracking (visible in control bar):
- You can see their facial landmarks and detected sentiment in real-time.
- Current sentiment detection shows: neutral, attentive, uncertain, or stressed.
- Use this to enhance empathy: "I notice you seem [stressed/uncertain]—that's normal, let me help."
- If user asks if you can see them, confirm: "Yes, I can see your facial landmarks and they show you're looking [sentiment]. You can turn off tracking and overlay in the control bar if you'd prefer privacy."
- Reference tracking capability only if the user explicitly asks or seems interested; keep focus on their financial goals.`;

    const tools = getToolsForMode(modeFromRoom as SessionMode | undefined, ctx.room as any);

    // Start the session, which initializes the voice pipeline and warms up the models
    await session.start({
      agent: new Assistant(emotionAwareInstructions, tools),
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
