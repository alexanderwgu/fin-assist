declare module 'd3-sankey' {
  // Minimal types to satisfy our usage in BudgetSankey.tsx
  export type SankeyNodeMinimal = {
    id: string;
    x0: number;
    x1: number;
    y0: number;
    y1: number;
  };

  export type SankeyLinkMinimal = {
    source: any;
    target: any;
    value: number;
    width?: number;
    y0?: number;
    y1?: number;
  };

  export function sankey<TNode = SankeyNodeMinimal, TLink = SankeyLinkMinimal>(): any;
  export function sankeyLinkHorizontal<TNode = SankeyNodeMinimal, TLink = SankeyLinkMinimal>(): (
    link: TLink
  ) => string | null;
}
