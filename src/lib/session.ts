import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import type { Role, User } from '@prisma/client';

const COOKIE_NAME = 'sentinel_session';

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload?.sub) return null;

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: { id: true, email: true, role: true, mfaEnabled: true },
  });

  return user;
}

export async function requireAuth(allowedRoles?: Role[]) {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    redirect('/login');
  }

  return user;
}