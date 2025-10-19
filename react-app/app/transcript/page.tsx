'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { readTranscript, type TranscriptItem } from '@/lib/transcript';
import { readSankey } from '@/lib/sankey';
import { BudgetSankey } from '@/components/app/BudgetSankey';

export default function TranscriptPage() {
  const [items, setItems] = useState<TranscriptItem[] | null>(null);
  const [endedAt, setEndedAt] = useState<number | null>(null);
  const [hasSankey, setHasSankey] = useState(false);
  const [sankeyNodes, setSankeyNodes] = useState<any[] | null>(null);
  const [sankeyLinks, setSankeyLinks] = useState<any[] | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [summaryLoading, setSummaryLoading] = useState<boolean>(true);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  useEffect(() => {
    const payload = readTranscript();
    if (payload) {
      setItems(payload.items);
      setEndedAt(payload.endedAt);
    } else {
      setItems([]);
    }
    const sankey = readSankey();
    if (sankey && sankey.links?.length) {
      setHasSankey(true);
      setSankeyNodes(sankey.nodes);
      setSankeyLinks(sankey.links);
    }
  }, []);

  useEffect(() => {
    const run = async () => {
      if (!items || items.length === 0) {
        setSummary(null);
        setSummaryLoading(false);
        return;
      }
      try {
        setSummaryLoading(true);
        setSummaryError(null);
        const body: any = { items };
        if (hasSankey && sankeyNodes && sankeyLinks) {
          body.sankey = { nodes: sankeyNodes, links: sankeyLinks };
        }
        const res = await fetch('/api/summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        const json = await res.json();
        setSummary(typeof json?.summary === 'string' ? json.summary : null);
      } catch (e) {
        setSummaryError('Unable to generate summary right now.');
        setSummary(null);
      } finally {
        setSummaryLoading(false);
      }
    };
    run();
  }, [items, hasSankey, sankeyNodes, sankeyLinks]);

  const title = useMemo(() => {
    if (!endedAt) return 'Conversation Transcript';
    const d = new Date(endedAt);
    return `Conversation Transcript – ${d.toLocaleString()}`;
  }, [endedAt]);

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">{title}</h1>
        <div className="flex gap-2">
          <Link href="/" className="rounded-md bg-black px-3 py-1 text-sm text-white">
            Back home
          </Link>
        </div>
      </header>

      {/* Summary */}
      <section className="mb-8">
        <h2 className="mb-2 text-lg font-semibold">Summary</h2>
        <div className="rounded-lg border bg-background/80 p-4 backdrop-blur-sm">
          {summaryLoading ? (
            <p className="text-sm text-muted-foreground">Summarizing…</p>
          ) : summaryError ? (
            <p className="text-sm text-red-600">{summaryError}</p>
          ) : summary ? (
            <p className="whitespace-pre-wrap text-sm leading-6">{summary}</p>
          ) : (
            <p className="text-sm text-muted-foreground">No summary available.</p>
          )}
        </div>
      </section>

      {hasSankey && sankeyNodes && sankeyLinks && (
        <section className="mb-8">
          <h2 className="mb-3 text-lg font-semibold">Budget Flow</h2>
          <div className="rounded-lg border bg-background/80 p-4 backdrop-blur-sm">
            <BudgetSankey nodes={sankeyNodes} links={sankeyLinks} />
          </div>
        </section>
      )}

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


