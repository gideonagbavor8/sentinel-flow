import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken, signToken, createSessionCookie } from '@/lib/auth';
import { verifySync } from 'otplib';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body as { token: string };

    if (!token) {
      return NextResponse.json({ error: 'Verification code is required' }, { status: 400 });
    }

    // 1. Retrieve the temporary pre-auth cookie
    const mfaPendingToken = request.cookies.get('sentinel_mfa_pending')?.value;
    if (!mfaPendingToken) {
      return NextResponse.json({ error: 'Verification session expired. Please log in again.' }, { status: 401 });
    }

    // 2. Validate the pre-auth token
    const payload = verifyToken(mfaPendingToken);
    if (!payload || !payload.mfa_pending) {
      return NextResponse.json({ error: 'Invalid verification session. Please log in again.' }, { status: 401 });
    }

    // 3. Retrieve user and verify the TOTP token
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user || !user.mfaSecret) {
      return NextResponse.json({ error: 'User security configuration not found.' }, { status: 404 });
    }

    const isValid = verifySync({ 
      token, 
      secret: user.mfaSecret,
      strategy: 'totp'
    });

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid verification code. Please check your authenticator app.' }, { status: 401 });
    }

    // 4. Success! Generate the final production session token
    const finalSessionToken = signToken({ sub: user.id, role: user.role });
    const response = createSessionCookie(finalSessionToken);
    
    // Clear the temporary "mfa pending" cookie
    response.cookies.set('sentinel_mfa_pending', '', { maxAge: 0, path: '/' });
    
    // Log the successful security event
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "Multi-Factor Authentication: Successful verification",
        ipAddress: "N/A",
        userAgent: "Auth Service"
      }
    });

    return response;
  } catch (error) {
    console.error('MFA Verification Error:', error);
    return NextResponse.json({ error: 'An internal error occurred during verification.' }, { status: 500 });
  }
}
