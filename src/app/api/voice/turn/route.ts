import { NextRequest } from "next/server";
import { runAgent } from "@/lib/agent";
import { transcribeAudio } from "@/lib/transcription";
import { synthesizeSpeech } from "@/lib/tts";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    if (!contentType.includes("multipart/form-data")) {
      return new Response("Expected multipart/form-data", { status: 400 });
    }

    const form = await req.formData();
    const audioFile = form.get("audio") as File | null;
    const voiceId = (form.get("voiceId") as string) || process.env.ELEVENLABS_VOICE_ID || "";
    const systemPrompt = (form.get("system") as string) || undefined;

    if (!audioFile) {
      return new Response("Missing audio file in 'audio' field", { status: 400 });
    }

    const audioArrayBuffer = await audioFile.arrayBuffer();
    const mimeType = audioFile.type || "audio/webm";

    // 1) STT
    const { text: userText } = await transcribeAudio(audioArrayBuffer, mimeType);

    // 2) Agent
    const { text: replyText } = await runAgent({ userText, systemPrompt });

    // 3) TTS
    const { audio, contentType } = await synthesizeSpeech({
      text: replyText,
      voiceId,
    });

    return new Response(audio, {
      headers: {
        "content-type": contentType,
        "x-transcript": encodeURIComponent(userText),
        "x-text": encodeURIComponent(replyText),
      },
    });
  } catch (err) {
    console.error(err);
    return new Response("Internal Server Error", { status: 500 });
  }
}


