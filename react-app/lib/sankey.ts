import type { SankeyLink, SankeyNode } from '@/hooks/useBudgetSankey';

export interface SankeyPayload {
  nodes: SankeyNode[];
  links: SankeyLink[];
  savedAt: number;
}

const STORAGE_KEY = 'finassist.sankey.latest';

export function saveSankey(nodes: SankeyNode[] | null, links: SankeyLink[] | null): void {
  if (typeof window === 'undefined') return;
  if (!nodes || !links || links.length === 0) return;
  try {
    const payload: SankeyPayload = { nodes, links, savedAt: Date.now() };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {}
}

export function readSankey(): SankeyPayload | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SankeyPayload;
  } catch {
    return null;
  }
}

export function clearSankey(): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {}
}


