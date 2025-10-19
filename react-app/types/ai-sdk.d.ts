declare module 'ai' {
  export function generateText(args: any): Promise<{ text?: string }>;
}

declare module '@ai-sdk/google' {
  export function createGoogleGenerativeAI(config: { apiKey?: string }): (model: string) => any;
}


