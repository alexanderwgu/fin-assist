import { llm } from '@livekit/agents';
import { z } from 'zod';

export type SessionMode = 'budgeting' | 'hotline';

export type ToolsMap = Record<string, unknown>;

type RoomLike = {
  localParticipant?: {
    publishData?: (data: Uint8Array, options: { reliable?: boolean; topic?: string }) => Promise<void> | void;
  };
};

export function getToolsForMode(mode: SessionMode | undefined, room: RoomLike): ToolsMap {
  const tools: ToolsMap = {};

  if (mode === 'budgeting') {
    tools.showBudgetSankey = llm.tool({
      description:
        "Display a Sankey diagram of the user's monthly budget. Provide 'nodes' and 'links' describing flows from income to allocations.",
      parameters: z.object({
        nodes: z
          .array(
            z.object({
              id: z.string().describe('Unique identifier for a node (e.g., "Income", "Rent")'),
            })
          )
          .min(2)
          .describe('Nodes in the Sankey diagram'),
        links: z
          .array(
            z.object({
              source: z.string().describe('Source node id (e.g., "Income")'),
              target: z.string().describe('Target node id (e.g., "Rent")'),
              value: z
                .number()
                .min(0.000001)
                .describe('Monthly amount flowing from source to target'),
            })
          )
          .min(1)
          .describe('Directed flows between nodes'),
      }),
      execute: async ({ nodes, links }) => {
        const payload = { type: 'budget_sankey', nodes, links };
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

  return tools;
}


