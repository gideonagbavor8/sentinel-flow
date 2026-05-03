'use client';

import type { FormEvent } from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
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
      if (data.error === 'USER_NOT_FOUND') {
        setError("We couldn't find an account matching that email. Please register to access the portal.");
      } else {
        setError(data.error || 'Unable to sign in');
      }
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

          {error && (
            <div className="flex gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-300">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex flex-col">
                <h3 className="text-sm font-semibold text-red-400 tracking-wide">
                  {error.includes('register') ? 'Account Not Found' : 'Authentication Error'}
                </h3>
                <p className="text-sm text-red-300/90 mt-1 leading-relaxed">
                  {error}
                </p>
                {error.includes('register') && (
                  <Link 
                    href="/register" 
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-red-400 hover:text-red-300 mt-3 transition-colors group w-fit pb-0.5 border-b border-red-500/30 hover:border-red-400"
                  >
                    {/* <span>Proceed to Registration</span> */}
                    {/* <span className="group-hover:translate-x-1 transition-transform">→</span> */}
                  </Link>
                )}
              </div>
            </div>
          )}

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