import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--primary)' }}>
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center" style={{ border: '1px solid var(--secondary)' }}>
        <div className="mb-6">
          <div className="p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: 'var(--secondary)' }}>
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#0f172a' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: '#0f172a' }}>Sentinel Flow</h1>
          <p style={{ color: '#475569' }}>Secure Project Management Portal</p>
        </div>

        <div className="space-y-3">
          <Link
            href="/login"
            className="block w-full py-2 px-4 rounded-md text-white transition-colors hover:opacity-90"
            style={{ backgroundColor: 'var(--secondary)' }}
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="block w-full py-2 px-4 rounded-md text-slate-900 border border-slate-300 transition-colors hover:bg-slate-100"
          >
            Create account
          </Link>
          <p className="text-sm" style={{ color: '#64748b' }}>
            Sign in to access the protected dashboard and secure file workflows.
          </p>
        </div>
      </div>
    </div>
  );
}