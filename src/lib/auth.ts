import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET;
const COOKIE_NAME = 'sentinel_session';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function signToken(payload: Record<string, string | number>) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: COOKIE_MAX_AGE });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { sub: string; role: string; iat: number; exp: number };
  } catch {
    return null;
  }
}

export function createSessionCookie(token: string) {
  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: COOKIE_MAX_AGE,
    sameSite: 'lax',
  });
  return response;
}

export function clearSessionCookie() {
  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: COOKIE_NAME,
    value: '',
    path: '/',
    maxAge: 0,
  });
  return response;
}

export function getSessionToken(cookieString: string | undefined) {
  return cookieString ?? null;
}