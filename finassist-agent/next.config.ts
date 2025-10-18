import type { NextConfig } from 'next';
import path from 'node:path';
import dotenv from 'dotenv';

// Load env from repo root
dotenv.config({ path: path.resolve(process.cwd(), '..', '.env.local') });

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
