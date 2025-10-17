import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();

  return NextResponse.json({
    success: true,
    action: body.action || 'unknown',
    voiceUrl: '/tts/guide.mp3',
    sentryUrl: 'https://sentry.io/traces/mock123',
    timestamp: Date.now(),
  });
}
