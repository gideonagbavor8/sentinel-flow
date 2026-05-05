import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server';
import { comparePassword, signToken, createSessionCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body as { email: string; password: string };

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' }, 
        { status: 400 }
      );
    }

    // Bypass Prisma/Direct DB ports entirely for the login check.
    // We use the Supabase Data API (HTTPS Port 443) which is never blocked by firewalls.
    const { data: user, error: userError } = await supabaseAdmin
      .from('User')
      .select('*')
      .eq('email', email)
      .single();

    if (userError || !user) {
      return NextResponse.json({ 
        error: 'USER_NOT_FOUND', 
        message: 'No account found with this email. Please register first.' 
      }, { status: 404 });
    }

    const passwordMatches = await comparePassword(password, user.passwordHash);
    if (!passwordMatches) {
      return NextResponse.json(
        { error: 'Invalid credentials' }, 
        { status: 401 }
      );
    }

    const token = signToken({ sub: user.id, role: user.role, email: user.email });
    return createSessionCookie(token);

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: String(error) }, 
      { status: 500 }
    );
  }
}