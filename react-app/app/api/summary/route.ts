import { NextResponse } from 'next/server';

export const revalidate = 0;

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL = 'gemini-2.5-flash';

type TranscriptItem = {
  timestamp: number;
  message: string;
  origin: 'local' | 'remote';
};

type SankeyNode = { id: string };
type SankeyLink = { source: string; target: string; value: number };

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const items = (body?.items ?? []) as TranscriptItem[];
    const sankeyNodes = (body?.sankey?.nodes ?? null) as SankeyNode[] | null;
    const sankeyLinks = (body?.sankey?.links ?? null) as SankeyLink[] | null;

    // Log request basics (sizes only, no PII)
    console.debug('[summary] request', {
      hasKey: Boolean(GEMINI_API_KEY),
      model: MODEL,
      itemsCount: Array.isArray(items) ? items.length : 0,
      hasSankey: Boolean(sankeyNodes && sankeyLinks && sankeyLinks.length),
    });

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ summary: 'No transcript to summarize.' }, { headers: { 'Cache-Control': 'no-store' } });
    }

    if (!GEMINI_API_KEY) {
      console.warn('[summary] fallback: missing GEMINI_API_KEY');
      const fallback = buildFallbackSummary(items, sankeyNodes, sankeyLinks);
      return NextResponse.json({ summary: fallback }, { headers: { 'Cache-Control': 'no-store' } });
    }

    const prompt = buildPrompt(items, sankeyNodes, sankeyLinks);

    // Prefer Vercel AI SDK (dynamic import). No raw HTTP fallback.
    try {
      console.debug('[summary] ai-sdk attempting', { model: MODEL });
      const { generateText } = await import('ai');
      const { createGoogleGenerativeAI } = await import('@ai-sdk/google');
      const google = createGoogleGenerativeAI({ apiKey: GEMINI_API_KEY });
      const modelInstance: any = google('models/' + MODEL);
      const result: any = await generateText({ model: modelInstance, prompt });
      const sdkText: string | undefined = typeof result?.text === 'string' ? result.text : undefined;
      console.debug('[summary] ai-sdk ok', { preview100: sdkText ? sdkText.slice(0, 100) : '' });
      if (sdkText && sdkText.trim().length > 0) {
        const headers = new Headers({ 'Cache-Control': 'no-store' });
        return NextResponse.json({ summary: sdkText.trim() }, { headers });
      }
      console.warn('[summary] ai-sdk returned empty text');
    } catch (e) {
      console.warn('[summary] ai-sdk unavailable or failed', {
        message: (e as Error)?.message,
      });
    }

    // If SDK fails or returns empty, use local fallback summary (no raw HTTP fallback)
    const summary = buildFallbackSummary(items, sankeyNodes, sankeyLinks);

    const headers = new Headers({ 'Cache-Control': 'no-store' });
    return NextResponse.json({ summary }, { headers });
  } catch (error) {
    console.error('[summary] unexpected error', { message: (error as Error)?.message });
    const headers = new Headers({ 'Cache-Control': 'no-store' });
    return NextResponse.json({ summary: 'Summary unavailable.' }, { headers, status: 200 });
  }
}

function buildPrompt(items: TranscriptItem[], nodes: SankeyNode[] | null, links: SankeyLink[] | null): string {
  const convo = items
    .slice(-120)
    .map((m) => `${m.origin === 'local' ? 'User' : 'Agent'}: ${m.message}`)
    .join('\n');

  const sankeyBlock = nodes && links && links.length
    ? `\n\nBudget Sankey (most recent):\nNodes: ${nodes.map((n) => n.id).join(', ')}\nTop Flows: ${links
        .slice(0, 10)
        .map((l) => `${l.source} -> ${l.target}: ${l.value}`)
        .join('; ')}`
    : '';

  return (
    'You are a calm, supportive financial mentor. Summarize the conversation below in 4-6 short bullet points (plain text, no titles):\n' +
    '- Capture user goals/concerns and agent guidance.\n' +
    '- Include 1-2 concrete next steps.\n' +
    '- Keep the tone reassuring, never shaming.\n' +
    (sankeyBlock ? '- Include 1-2 insights from the budget flows.\n' : '') +
    '\nConversation:\n' +
    convo +
    sankeyBlock
  );
}

function buildFallbackSummary(items: TranscriptItem[], nodes: SankeyNode[] | null, links: SankeyLink[] | null): string {
  const lastUser = [...items].reverse().find((m) => m.origin === 'local');
  const hintedNeed = lastUser?.message ? `User focus: ${truncate(lastUser.message, 140)}` : 'User focus: general budgeting support';
  const hasSankey = Boolean(nodes && links && links.length);
  return [
    '• Discussed financial goals and current concerns.',
    `• ${hintedNeed}.`,
    '• Provided calm, step-by-step guidance.',
    hasSankey ? '• Reviewed budget flows and prioritized key spending areas.' : '• Encouraged simple budgeting steps and next actions.',
    '• Next steps: set a weekly check-in and track one spending category.',
  ].join('\n');
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max - 1) + '…';
}


