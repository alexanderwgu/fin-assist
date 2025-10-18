import { useEffect, useState } from 'react';
import { useRoomContext } from '@livekit/components-react';
import type { RoomEvent } from 'livekit-client';

export type SankeyNode = { id: string };
export type SankeyLink = { source: string; target: string; value: number };

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


