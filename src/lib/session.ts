import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from './auth';

export async function getServerSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('sentinel_session')?.value;

  if (!token) {
    return null;
  }

  const payload = verifyToken(token);
  if (!payload) {
    return null;
  }

  return {
    user: {
      id: payload.sub,
      role: payload.role,
    },
  };
}

export async function requireAuth() {
  const session = await getServerSession();
  if (!session) {
    redirect('/login');
  }
  return session;
}