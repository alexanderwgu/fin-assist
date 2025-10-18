import { cache } from 'react';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { APP_CONFIG_DEFAULTS } from '@/app-config';
import type { AppConfig } from '@/app-config';

export const CONFIG_ENDPOINT = process.env.NEXT_PUBLIC_APP_CONFIG_ENDPOINT || '/api/app-config';
export const SANDBOX_ID = process.env.SANDBOX_ID;

export const THEME_STORAGE_KEY = 'theme-mode';
export const THEME_MEDIA_QUERY = '(prefers-color-scheme: dark)';

export interface SandboxConfig {
  [key: string]:
    | { type: 'string'; value: string }
    | { type: 'number'; value: number }
    | { type: 'boolean'; value: boolean }
    | null;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// https://react.dev/reference/react/cache#caveats
// > React will invalidate the cache for all memoized functions for each server request.
export const getAppConfig = cache(async (headers: Headers): Promise<AppConfig> => {
  const sandboxId = SANDBOX_ID ?? headers.get('x-sandbox-id') ?? '';

  try {
    // Allow CONFIG_ENDPOINT to be relative (e.g. '/api/app-config') on the server by resolving against request origin
    const proto = headers.get('x-forwarded-proto');
    const host = headers.get('host');
    const inferredOrigin = proto && host ? `${proto}://${host}` : undefined;
    const fallbackOrigin =
      process.env.NEXT_PUBLIC_SITE_URL ??
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
    const base = inferredOrigin ?? fallbackOrigin;
    const endpointUrl = new URL(CONFIG_ENDPOINT, base);

    const response = await fetch(endpointUrl.toString(), {
      cache: 'no-store',
      headers: sandboxId ? { 'X-Sandbox-ID': sandboxId } : undefined,
    });

    // Accept either our SandboxConfig shape or a direct AppConfig
    const json = await response.json();
    if (json && json.pageTitle && json.companyName) {
      return { ...APP_CONFIG_DEFAULTS, ...json } satisfies AppConfig;
    }

    const remoteConfig: SandboxConfig = json;
    const config: AppConfig = { ...APP_CONFIG_DEFAULTS, sandboxId };

    for (const [key, entry] of Object.entries(remoteConfig)) {
      if (entry === null) continue;
      if (
        (key in APP_CONFIG_DEFAULTS && APP_CONFIG_DEFAULTS[key as keyof AppConfig] === undefined) ||
        (typeof config[key as keyof AppConfig] === entry.type &&
          typeof config[key as keyof AppConfig] === typeof entry.value)
      ) {
        // @ts-expect-error see above
        config[key as keyof AppConfig] = entry.value as AppConfig[keyof AppConfig];
      }
    }

    return config;
  } catch (error) {
    console.error('ERROR: getAppConfig() - lib/utils.ts', error);
    return APP_CONFIG_DEFAULTS;
  }
});

// check provided accent colors against defaults
// apply styles if they differ (or in development mode)
// generate a hover color for the accent color by mixing it with 20% black
export function getStyles(appConfig: AppConfig) {
  const { accent, accentDark } = appConfig;

  return [
    accent
      ? `:root { --primary: ${accent}; --primary-hover: color-mix(in srgb, ${accent} 80%, #000); }`
      : '',
    accentDark
      ? `.dark { --primary: ${accentDark}; --primary-hover: color-mix(in srgb, ${accentDark} 80%, #000); }`
      : '',
  ]
    .filter(Boolean)
    .join('\n');
}
