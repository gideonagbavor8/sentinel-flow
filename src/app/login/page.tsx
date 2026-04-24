'use client';

import type { FormEvent } from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '@/app/auth-form.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);

    if (!response.ok) {
      const data = await response.json();
      setError(data?.error || 'Unable to sign in');
      return;
    }

    router.push('/dashboard');
  }

  return (
    <div className={styles.authPage}>
      <div className={styles.authCard}>
        <h1 className={`${styles.authTitle} text-2xl font-bold mb-6`}>Sign in to Sentinel Flow</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className={`${styles.authLabel} block text-sm font-medium mb-2`}>
              Email
            </label>
            <input
              id="email"
              title="Email address"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              required
              className={`${styles.authInput}`}
            />
          </div>
          <div>
            <label htmlFor="password" className={`${styles.authLabel} block text-sm font-medium mb-2`}>
              Password
            </label>
            <input
              id="password"
              title="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              required
              className={`${styles.authInput}`}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button type="submit" className={`${styles.authButton}`} disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className={`${styles.authDescription} mt-6 text-sm`}>
          Don’t have an account?{' '}
          <Link href="/register" className={styles.authLink}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}