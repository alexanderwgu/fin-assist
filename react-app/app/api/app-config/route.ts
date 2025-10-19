import { NextResponse } from 'next/server';

export async function GET() {
  // Return the default app configuration for CalmCall
  const config = {
    pageTitle: 'CalmCall - Financial Wellness Assistant',
    pageDescription: 'Your compassionate financial wellness companion',
    companyName: 'CalmCall',
    supportsChatInput: true,
    supportsVideoInput: true,
    supportsScreenShare: false,
    isPreConnectBufferEnabled: true,
    logo: '/lk-logo.svg',
    startButtonText: 'Start Financial Consultation',
    accent: '#10b981',
    logoDark: '/lk-logo-dark.svg',
    accentDark: '#34d399',
  };

  return NextResponse.json(config);
}
