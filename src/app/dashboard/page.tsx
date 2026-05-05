import { getServerSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase-server';

export default async function DashboardPage() {
  const session = await getServerSession();

  if (!session) {
    redirect('/login');
  }

  // Optimized fetching using Supabase Data API (HTTPS Port 443) 
  // This bypasses the blocked database ports that were causing the hangs.
  
  const { count: projectCount } = await supabaseAdmin
    .from('Project')
    .select('*', { count: 'exact', head: true })
    .eq('userId', session.user.id);

  const { count: actualFileCount } = await supabaseAdmin
    .from('File')
    .select('*, project!inner(*)', { count: 'exact', head: true })
    .eq('project.userId', session.user.id);

  return (
    <div className="space-y-10 p-8 min-h-screen bg-[var(--background)]">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-theme-black">
          Dashboard Overview
        </h1>
        <p className="text-theme-dark text-lg">
          Monitoring Sentinel Flow security metrics and system health.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 bg-theme-white backdrop-blur-sm rounded-3xl border border-theme-light shadow-lg transition-all hover:scale-[1.02] hover:bg-theme-light/10 group">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-theme-mid group-hover:text-theme-dark transition-colors">Active Threats</p>
          <p className="text-5xl font-black mt-4 text-theme-black">0</p>
        </div>
        <div className="p-8 bg-theme-white backdrop-blur-sm rounded-3xl border border-theme-light shadow-lg transition-all hover:scale-[1.02] hover:bg-theme-light/10 group">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-theme-mid group-hover:text-theme-dark transition-colors">System Integrity</p>
          <p className="text-5xl font-black mt-4 text-theme-black">99.9%</p>
        </div>
        <div className="p-8 bg-theme-white backdrop-blur-sm rounded-3xl border border-theme-light shadow-lg transition-all hover:scale-[1.02] hover:bg-theme-light/10 group">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-theme-mid group-hover:text-theme-dark transition-colors">Total Projects</p>
          <p className="text-5xl font-black mt-4 text-theme-black">{projectCount || 0}</p>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-theme-black mb-6">System Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-theme-white rounded-2xl border border-theme-light">
            <p className="text-theme-mid text-sm mb-1">Total Protected Files</p>
            <p className="text-3xl font-bold text-theme-black">{actualFileCount || 0}</p>
          </div>
          <div className="p-6 bg-theme-white rounded-2xl border border-theme-light">
            <p className="text-theme-mid text-sm mb-1">Security Status</p>
            <p className="text-3xl font-bold text-theme-dark">Secure</p>
          </div>
        </div>
      </div>
    </div>
  );
}