import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Get the IP from headers (standard for production/proxies)
  // 2. Fallback to the 'ip' property if it exists
  // 3. Fallback to local loopback if all else fails
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : (request as any).ip ?? '127.0.0.1';

  const url = request.url;

  // Logging for your Audit System
  console.log(`[AUDIT]: Request from ${ip} to ${url} at ${new Date().toISOString()}`);

  const response = NextResponse.next();

  // Security Headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  return response;
}