'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { readTranscript, clearTranscript, type TranscriptItem } from '@/lib/transcript';

export default function TranscriptPage() {
  const [items, setItems] = useState<TranscriptItem[] | null>(null);
  const [endedAt, setEndedAt] = useState<number | null>(null);

  useEffect(() => {
    const payload = readTranscript();
    if (payload) {
      setItems(payload.items);
      setEndedAt(payload.endedAt);
    } else {
      setItems([]);
    }
  }, []);

  const title = useMemo(() => {
    if (!endedAt) return 'Conversation Transcript';
    const d = new Date(endedAt);
    return `Conversation Transcript – ${d.toLocaleString()}`;
  }, [endedAt]);

  const handleClear = () => {
    clearTranscript();
    setItems([]);
  };

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">{title}</h1>
        <div className="flex gap-2">
          <button
            onClick={handleClear}
            className="rounded-md border px-3 py-1 text-sm"
            title="Clear saved transcript"
          >
            Clear
          </button>
          <Link href="/" className="rounded-md bg-black px-3 py-1 text-sm text-white">
            Back home
          </Link>
        </div>
      </header>

      {!items || items.length === 0 ? (
        <p className="text-muted-foreground">No transcript available.</p>
      ) : (
        <ol className="space-y-3">
          {items.map((m, idx) => (
            <li key={idx} className="flex flex-col gap-1">
              <div className="text-xs text-gray-500">
                <span className="font-mono">
                  {new Date(m.timestamp).toLocaleTimeString(undefined, { timeStyle: 'short' })}
                </span>{' '}
                · <span className="uppercase">{m.origin}</span>
              </div>
              <div
                className={
                  m.origin === 'local'
                    ? 'ml-auto max-w-[80%] rounded-2xl bg-gray-100 px-3 py-2'
                    : 'mr-auto max-w-[80%] rounded-2xl bg-gray-50 px-3 py-2'
                }
              >
                {m.message}
              </div>
            </li>
          ))}
        </ol>
      )}
    </main>
  );
}


