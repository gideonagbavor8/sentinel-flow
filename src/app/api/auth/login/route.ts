import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { comparePassword, signToken, createSessionCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, password } = body as { email: string; password: string };

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ 
      error: 'USER_NOT_FOUND', 
      message: 'No account found with this email. Please register first.' 
    }, { status: 404 });
  }

  const passwordMatches = await comparePassword(password, user.passwordHash);
  if (!passwordMatches) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = signToken({ sub: user.id, role: user.role });
  return createSessionCookie(token);
}