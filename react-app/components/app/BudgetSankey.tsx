'use client';

import React, { useEffect, useRef } from 'react';
import { sankeyLinkHorizontal } from 'd3-sankey';
import { select } from 'd3-selection';
import type { BudgetLink, BudgetNode } from '@/hooks/useBudgetSankey';

interface BudgetSankeyProps {
  nodes: BudgetNode[];
  links: BudgetLink[];
}

interface D3Link {
  source: number | BudgetNode;
  target: number | BudgetNode;
  value: number;
  index?: number;
  width?: number;
}

interface D3Node {
  name: string;
  category: 'income' | 'expense' | 'savings';
  index?: number;
  x0?: number;
  y0?: number;
  x1?: number;
  y1?: number;
}

export function BudgetSankey({ nodes, links }: BudgetSankeyProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !nodes.length || !links.length) return;

    const svg = select(svgRef.current);
    const width = 800;
    const height = 400;

    // Clear previous content
    svg.selectAll('*').remove();

    // Set up SVG dimensions
    svg
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height])
      .attr('class', 'overflow-visible');

    // Create gradients for different categories
    const defs = svg.append('defs');

    const incomeGradient = defs
      .append('linearGradient')
      .attr('id', 'income-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '0%');

    incomeGradient.append('stop').attr('offset', '0%').attr('stop-color', '#10b981'); // green-500

    incomeGradient.append('stop').attr('offset', '100%').attr('stop-color', '#059669'); // green-600

    const expenseGradient = defs
      .append('linearGradient')
      .attr('id', 'expense-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '0%');

    expenseGradient.append('stop').attr('offset', '0%').attr('stop-color', '#f59e0b'); // amber-500

    expenseGradient.append('stop').attr('offset', '100%').attr('stop-color', '#d97706'); // amber-600

    const savingsGradient = defs
      .append('linearGradient')
      .attr('id', 'savings-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '0%');

    savingsGradient.append('stop').attr('offset', '0%').attr('stop-color', '#3b82f6'); // blue-500

    savingsGradient.append('stop').attr('offset', '100%').attr('stop-color', '#2563eb'); // blue-600

    // Draw links (flows)
    svg
      .append('g')
      .attr('class', 'links')
      .selectAll('path')
      .data(links)
      .join('path')
      .attr('d', (d) => sankeyLinkHorizontal()(d as D3Link))
      .attr('stroke', (d) => {
        const targetNode =
          typeof d.target === 'object' ? d.target : nodes.find((n) => n.index === d.target);
        const targetCategory = targetNode?.category || 'expense';
        switch (targetCategory) {
          case 'income':
            return 'url(#income-gradient)';
          case 'expense':
            return 'url(#expense-gradient)';
          case 'savings':
            return 'url(#savings-gradient)';
          default:
            return '#6b7280'; // gray-500
        }
      })
      .attr('stroke-width', (d) => Math.max(1, (d as D3Link).width || 0))
      .attr('stroke-opacity', 0.6)
      .attr('fill', 'none');

    // Draw nodes (rectangles)
    svg
      .append('g')
      .attr('class', 'nodes')
      .selectAll('rect')
      .data(nodes)
      .join('rect')
      .attr('x', (d) => (d as D3Node).x0 || 0)
      .attr('y', (d) => (d as D3Node).y0 || 0)
      .attr('height', (d) => ((d as D3Node).y1 || 0) - ((d as D3Node).y0 || 0))
      .attr('width', (d) => ((d as D3Node).x1 || 0) - ((d as D3Node).x0 || 0))
      .attr('fill', (d) => {
        if (!d.category) return '#6b7280';
        switch (d.category) {
          case 'income':
            return 'url(#income-gradient)';
          case 'expense':
            return 'url(#expense-gradient)';
          case 'savings':
            return 'url(#savings-gradient)';
          default:
            return '#6b7280'; // gray-500
        }
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 1)
      .attr('rx', 4);

    // Add labels
    svg
      .append('g')
      .attr('class', 'labels')
      .selectAll('text')
      .data(nodes)
      .join('text')
      .attr('x', (d) =>
        ((d as D3Node).x0 || 0) < width / 2
          ? ((d as D3Node).x1 || 0) + 6
          : ((d as D3Node).x0 || 0) - 6
      )
      .attr('y', (d) => (((d as D3Node).y1 || 0) + ((d as D3Node).y0 || 0)) / 2)
      .attr('dy', '0.35em')
      .attr('text-anchor', (d) => (((d as D3Node).x0 || 0) < width / 2 ? 'start' : 'end'))
      .attr('font-family', 'system-ui, -apple-system, sans-serif')
      .attr('font-size', '12px')
      .attr('fill', '#374151') // gray-700
      .text((d) => d.name);
  }, [nodes, links]);

  if (!nodes.length || !links.length) {
    return (
      <div className="text-muted-foreground flex h-64 w-full items-center justify-center">
        No budget data available
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4 text-center">
        <h3 className="text-foreground text-lg font-semibold">Budget Flow</h3>
        <p className="text-muted-foreground text-sm">Income to expense visualization</p>
      </div>
      <div className="flex justify-center">
        <svg ref={svgRef} className="w-full max-w-4xl" style={{ minHeight: '400px' }} />
      </div>
    </div>
  );
}
