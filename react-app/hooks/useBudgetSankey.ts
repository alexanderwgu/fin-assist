import { useEffect, useState } from 'react';
import type { RoomEvent } from 'livekit-client';
import { useRoomContext } from '@livekit/components-react';

// Base types before D3 processing
export type SankeyNode = { id: string };
export type SankeyLink = { source: string; target: string; value: number };

// Extended types after D3 Sankey layout processing
export interface D3SankeyNode extends SankeyNode {
  x0?: number;
  x1?: number;
  y0?: number;
  y1?: number;
}

export interface D3SankeyLink {
  source: string | D3SankeyNode;
  target: string | D3SankeyNode;
  value: number;
  width?: number;
  y0?: number;
  y1?: number;
}

export function useBudgetSankey() {
  const room = useRoomContext();
  const [nodes, setNodes] = useState<SankeyNode[] | null>(null);
  const [links, setLinks] = useState<SankeyLink[] | null>(null);

  useEffect(() => {
    function handleData(data: Uint8Array, participantIdentity?: string, topic?: string) {
      try {
        const text = new TextDecoder().decode(data);
        const payload = JSON.parse(text);
        if (payload?.type === 'budget_sankey') {
          setNodes(payload.nodes ?? null);
          setLinks(payload.links ?? null);
        }
      } catch (_) {
        // ignore malformed payloads
      }
    }

    room.on('dataReceived' as unknown as RoomEvent, handleData as any);
    return () => {
      room.off('dataReceived' as unknown as RoomEvent, handleData as any);
    };
  }, [room]);

  return { nodes, links };
}
