import { NextResponse } from 'next/server';
import { APP_CONFIG_DEFAULTS } from '@/app-config';

export const revalidate = 0;

export async function GET(req: Request) {
  const headers = new Headers({ 'Cache-Control': 'no-store' });
  const sandboxId = (req.headers.get('x-sandbox-id') ?? '').trim();

  const config = {
    ...APP_CONFIG_DEFAULTS,
    sandboxId: sandboxId || APP_CONFIG_DEFAULTS.sandboxId,
  };

  return NextResponse.json(config, { headers });
}

