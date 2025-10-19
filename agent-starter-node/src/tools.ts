import { llm } from '@livekit/agents';
import { z } from 'zod';

export function getToolsForMode(mode?: string, room?: any) {
  const tools: Record<string, any> = {};

  if (mode === 'budgeting') {
    tools.showBudgetSankey = llm.tool({
      description: "Display a Sankey diagram of the user's monthly budget. Provide 'nodes' and 'links' describing flows from income to allocations.",
      parameters: z.object({
        nodes: z
          .array(z.object({
            id: z.string().describe('Unique identifier for a node (e.g., "Income", "Rent")'),
          }))
          .min(2)
          .describe('Nodes in the Sankey diagram'),
        links: z
          .array(z.object({
            source: z.string().describe('Source node id (e.g., "Income")'),
            target: z.string().describe('Target node id (e.g., "Rent")'),
            value: z
              .number()
              .min(0.000001)
              .describe('Monthly amount flowing from source to target'),
          }))
          .min(1)
          .describe('Directed flows between nodes'),
      }),
      execute: async ({ nodes, links }) => {
        // Sanitize: ensure all link endpoints exist as nodes; dedupe nodes by id
        const nodeMap = new Map();
        for (const n of nodes) {
          if (typeof n?.id === 'string' && n.id.trim()) {
            nodeMap.set(n.id, { id: n.id });
          }
        }
        for (const l of links) {
          const s = String(l.source);
          const t = String(l.target);
          if (s && !nodeMap.has(s))
            nodeMap.set(s, { id: s });
          if (t && !nodeMap.has(t))
            nodeMap.set(t, { id: t });
        }
        const sanitizedNodes = Array.from(nodeMap.values());
        const payload = { type: 'budget_sankey', nodes: sanitizedNodes, links };
        const data = new TextEncoder().encode(JSON.stringify(payload));
        try {
          await room.localParticipant?.publishData?.(data, { reliable: true, topic: 'ui' });
          return 'Showing a budget Sankey diagram.';
        } catch (err) {
          console.error('Failed to publish Sankey data', err);
          return 'I could not display the chart right now.';
        }
      },
    });
  }

  // Web search tool (available in both modes). Uses Tavily with basic depth only to limit credits.
  tools.webSearch = llm.tool({
    description: 'Search the web and return top results (titles and URLs). Uses basic depth to conserve credits.',
    parameters: z.object({
      query: z.string().min(3).describe('What to search for'),
      maxResults: z
        .number()
        .int()
        .min(1)
        .max(5)
        .describe('Limit results (required 1-5; use 5 by default to conserve credits).'),
    }),
    execute: async ({ query, maxResults }) => {
      const apiKey = process.env.TAVILY_API_KEY;
      if (!apiKey) {
        return 'Web search is not configured (missing TAVILY_API_KEY).';
      }
      const capped = Math.min(5, Math.max(1, Math.trunc(maxResults)));
      try {
        const response = await fetch('https://api.tavily.com/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            api_key: apiKey,
            query,
            search_depth: 'basic',
            max_results: capped,
          }),
        });
        if (!response.ok) {
          return `Search failed: ${response.status} ${response.statusText}`;
        }
        const data = (await response.json());
        const items = Array.isArray(data?.results) ? data.results.slice(0, capped) : [];
        if (!items.length)
          return `No results for "${query}".`;
        const lines = items.map((r: any) => `- ${r.title ?? r.url ?? 'Result'} — ${r.url ?? ''}`);
        return `Top results for "${query}":\n${lines.join('\n')}`;
      } catch (error) {
        console.error('webSearch error', error);
        return 'Search is temporarily unavailable.';
      }
    },
  });

  return tools;
}
