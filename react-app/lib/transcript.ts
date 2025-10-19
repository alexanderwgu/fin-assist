// Minimal client-side transcript storage for navigation handoff
// Stores the latest transcript payload in sessionStorage

import type { ReceivedChatMessage } from '@livekit/components-react';

export type TranscriptItem = Pick<ReceivedChatMessage, 'timestamp' | 'message'> & {
  origin: 'local' | 'remote';
};

export interface TranscriptPayload {
  items: TranscriptItem[];
  endedAt: number;
}

const STORAGE_KEY = 'finassist.transcript.latest';

export function saveTranscript(items: TranscriptItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    const payload: TranscriptPayload = { items, endedAt: Date.now() };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {}
}

export function readTranscript(): TranscriptPayload | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as TranscriptPayload;
  } catch {
    return null;
  }
}

export function clearTranscript(): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {}
}


