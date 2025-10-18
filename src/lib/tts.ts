import { experimental_generateAudio as generateAudio } from "ai";
import { elevenlabs } from "@ai-sdk/elevenlabs";

export type TTSRequest = {
  text: string;
  voiceId: string; // e.g. Rachel's voice id
  modelId?: string; // e.g. "eleven_multilingual_v2"
  format?: "mp3" | "wav" | "pcm";
};

export type TTSResult = {
  audio: Uint8Array; // raw audio bytes
  contentType: string;
};

export async function synthesizeSpeech({
  text,
  voiceId,
  modelId = "eleven_multilingual_v2",
  format = "mp3",
}: TTSRequest): Promise<TTSResult> {
  const audioModel = elevenlabs.audio("text-to-speech");

  const { audio, mimeType } = await generateAudio({
    model: audioModel,
    voice: voiceId,
    format,
    providerOptions: {
      modelId,
    },
    text,
  });

  return { audio, contentType: mimeType };
}


