'use client';

import { useMemo, useState } from 'react';
import { SankeyLink, SankeyNode, sankey, sankeyLinkHorizontal } from 'd3-sankey';

export interface BudgetNode {
  name: string;
  category: 'income' | 'expense' | 'savings';
  index?: number;
  x0?: number;
  x1?: number;
  y0?: number;
  y1?: number;
  sourceLinks?: any[];
  targetLinks?: any[];
}

export interface BudgetLink {
  source: BudgetNode | string | number;
  target: BudgetNode | string | number;
  value: number;
  index?: number;
}

export interface BudgetSankeyData {
  nodes: BudgetNode[];
  links: BudgetLink[];
}

// Sample budget data - in a real app, this would come from user input or API
const sampleBudgetData: BudgetSankeyData = {
  nodes: [
    { name: 'Salary', category: 'income', index: 0 },
    { name: 'Freelance', category: 'income', index: 1 },
    { name: 'Housing', category: 'expense', index: 2 },
    { name: 'Food', category: 'expense', index: 3 },
    { name: 'Transportation', category: 'expense', index: 4 },
    { name: 'Entertainment', category: 'expense', index: 5 },
    { name: 'Savings', category: 'savings', index: 6 },
  ],
  links: [
    { source: 0, target: 2, value: 1500, index: 0 }, // Salary -> Housing
    { source: 0, target: 3, value: 600, index: 1 }, // Salary -> Food
    { source: 0, target: 4, value: 300, index: 2 }, // Salary -> Transportation
    { source: 0, target: 5, value: 200, index: 3 }, // Salary -> Entertainment
    { source: 0, target: 6, value: 400, index: 4 }, // Salary -> Savings
    { source: 1, target: 2, value: 300, index: 5 }, // Freelance -> Housing
    { source: 1, target: 3, value: 200, index: 6 }, // Freelance -> Food
    { source: 1, target: 6, value: 500, index: 7 }, // Freelance -> Savings
  ],
};

export function useBudgetSankey() {
  const [budgetData] = useState<BudgetSankeyData>(sampleBudgetData);

  const sankeyData = useMemo(() => {
    if (!budgetData.nodes.length || !budgetData.links.length) {
      return { nodes: [], links: [] };
    }

    const sankeyGenerator = sankey<BudgetNode, BudgetLink>()
      .nodeWidth(15)
      .nodePadding(10)
      .extent([
        [0, 0],
        [800, 400],
      ]);

    // Create a copy of the data for D3 processing
    const graph = {
      nodes: budgetData.nodes.map((node) => ({ ...node })),
      links: budgetData.links.map((link) => ({
        source: link.source,
        target: link.target,
        value: link.value,
        index: link.index,
      })),
    };

    const { nodes, links } = sankeyGenerator(graph);

    return { nodes, links };
  }, [budgetData]);

  return sankeyData;
}
