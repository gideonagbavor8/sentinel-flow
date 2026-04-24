export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#0f172a' }}>Dashboard Overview</h1>
        <p style={{ color: '#64748b' }}>Monitoring Sentinel Flow security metrics.</p>
      </div>

      {/* Placeholder for your future stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-xl border shadow-sm" style={{ borderColor: 'var(--secondary)' }}>
          <p className="text-sm font-medium" style={{ color: '#64748b' }}>Active Threats</p>
          <p className="text-2xl font-bold text-red-600">0</p>
        </div>
        <div className="p-6 bg-white rounded-xl border shadow-sm" style={{ borderColor: 'var(--secondary)' }}>
          <p className="text-sm font-medium" style={{ color: '#64748b' }}>System Integrity</p>
          <p className="text-2xl font-bold text-green-600">99.9%</p>
        </div>
        <div className="p-6 bg-white rounded-xl border shadow-sm" style={{ borderColor: 'var(--secondary)' }}>
          <p className="text-sm font-medium" style={{ color: '#64748b' }}>Total Projects</p>
          <p className="text-2xl font-bold" style={{ color: '#0f172a' }}>12</p>
        </div>
      </div>
    </div>
  );
}