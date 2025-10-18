'use client';

import React from 'react';
import type { SankeyLink, SankeyNode } from '@/hooks/useBudgetSankey';

interface BudgetSankeyProps {
  nodes: SankeyNode[];
  links: SankeyLink[];
}

// Minimal SVG sankey-like rendering (simple vertical list of flows)
// This avoids adding new heavy chart dependencies.
export function BudgetSankey({ nodes, links }: BudgetSankeyProps) {
  // map node id to index
  const nodeIndex = new Map(nodes.map((n, i) => [n.id, i] as const));
  const height = Math.max(200, links.length * 24 + 40);
  const width = 600;

  return (
    <div className="rounded-md border p-3">
      <h3 className="mb-2 font-semibold">Budget Flow</h3>
      <svg width={width} height={height} className="w-full">
        {/* nodes as labels */}
        {nodes.map((n, i) => (
          <text key={n.id} x={10} y={20 + i * 20} fontSize={12} fill="currentColor">
            {n.id}
          </text>
        ))}
        {/* links as lines with thickness proportional to value */}
        {links.map((l, i) => {
          const s = nodeIndex.get(l.source) ?? 0;
          const t = nodeIndex.get(l.target) ?? 0;
          const y1 = 20 + s * 20;
          const y2 = 20 + t * 20;
          const strokeWidth = Math.max(2, Math.log10(l.value + 10));
          return (
            <g key={`${l.source}-${l.target}-${i}`}>
              <line x1={150} y1={y1} x2={450} y2={y2} stroke="currentColor" strokeWidth={strokeWidth} />
              <text x={300} y={(y1 + y2) / 2 - 4} fontSize={11} textAnchor="middle" fill="currentColor">
                ${'{'}l.value{'}'}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}


