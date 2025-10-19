 'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { sankey as d3Sankey, sankeyLinkHorizontal } from 'd3-sankey';
import type { SankeyLink, SankeyNode } from '@/hooks/useBudgetSankey';

interface BudgetSankeyProps {
  nodes: SankeyNode[];
  links: SankeyLink[];
}

export function BudgetSankey({ nodes, links }: BudgetSankeyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>(600);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const nextWidth = Math.min(700, Math.max(320, Math.floor(entry.contentRect.width)));
        setWidth(nextWidth);
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const height = useMemo(() => {
    const minHeight = 240;
    const estimated = Math.max(nodes.length, links.length) * 28 + 80;
    return Math.max(minHeight, Math.min(800, estimated));
  }, [nodes.length, links.length]);

  const graph = useMemo(() => {
    const generator = d3Sankey<any, any>()
      .nodeId((d: any) => d.id)
      .nodeWidth(12)
      .nodePadding(12)
      .extent([[8, 8], [width - 8, height - 8]]);

    try {
      return generator({
        nodes: nodes.map((n) => ({ ...n })),
        links: links.map((l) => ({ ...l })),
      } as any);
    } catch {
      return null;
    }
  }, [nodes, links, width, height]);

  if (!graph) {
    return (
      <div className="rounded-md border p-3 text-sm text-muted-foreground">
        Unable to render chart.
      </div>
    );
  }

  return (
    <div ref={containerRef} className="rounded-md border p-3 text-foreground">
      <h3 className="mb-2 font-semibold">Budget Flow</h3>
      <svg width={width} height={height} className="w-full">
        <g>
          {graph.links.map((l: any, i: number) => {
            const path = sankeyLinkHorizontal<any, any>()(l);
            const strokeWidth = Math.max(1, l.width ?? 1);
            return (
              <path
                key={`link-${i}`}
                d={path ?? ''}
                fill="none"
                stroke="currentColor"
                strokeOpacity={0.35}
                strokeWidth={strokeWidth}
              />
            );
          })}
        </g>
        <g>
          {graph.nodes.map((n: any, i: number) => {
            const x = n.x0 ?? 0;
            const y = n.y0 ?? 0;
            const w = Math.max(1, (n.x1 ?? 0) - x);
            const h = Math.max(1, (n.y1 ?? 0) - y);
            return (
              <g key={`node-${i}`}>
                <rect
                  x={x}
                  y={y}
                  width={w}
                  height={h}
                  rx={3}
                  fill="currentColor"
                  fillOpacity={0.08}
                  stroke="currentColor"
                  strokeOpacity={0.5}
                />
                <text
                  x={x < width / 2 ? (n.x1 ?? 0) + 6 : x - 6}
                  y={y + h / 2}
                  dy="0.35em"
                  fontSize={12}
                  textAnchor={x < width / 2 ? 'start' : 'end'}
                  fill="currentColor"
                >
                  {n.id}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}


