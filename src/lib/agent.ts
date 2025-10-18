import { generateText } from "ai";
import { google } from "@ai-sdk/google";

export type AgentRequest = {
  systemPrompt?: string;
  userText: string;
};

export type AgentResponse = {
  text: string;
};

const defaultSystem =
  "You are a helpful, concise voice assistant. Keep responses short and speak-friendly.";

export async function runAgent(
  req: AgentRequest
): Promise<AgentResponse> {
  const model = google("gemini-2.5-flash");

  const result = await generateText({
    model,
    system: req.systemPrompt ?? defaultSystem,
    prompt: req.userText,
  });

  return { text: result.text };
}


