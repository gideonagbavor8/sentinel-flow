import prisma from '@/lib/prisma';
import { getServerSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await getServerSession();

  if (!session) {
    redirect('/login');
  }

  // Fetch real stats
  const projectCount = await prisma.project.count({
    where: { userId: session.user.id }
  });

  const fileCount = await prisma.project.count({
    where: { userId: session.user.id },
    // This is a bit simplified, ideally we'd count files across projects
  });
  
  // For now, let's just get the count of files belonging to user's projects
  const actualFileCount = await prisma.file.count({
    where: { project: { userId: session.user.id } }
  });

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
          <p className="text-5xl font-black mt-4 text-theme-black">{projectCount}</p>
        </div>
      </div>

      {/* New Section: Recent Activity or Files */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-theme-black mb-6">System Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-theme-white rounded-2xl border border-theme-light">
            <p className="text-theme-mid text-sm mb-1">Total Protected Files</p>
            <p className="text-3xl font-bold text-theme-black">{actualFileCount}</p>
          </div>
          <div className="p-6 bg-theme-white rounded-2xl border border-theme-light">
            <p className="text-theme-mid text-sm mb-1">MFA Status</p>
            <p className="text-3xl font-bold text-theme-dark">Enabled</p>
          </div>
        </div>
      </div>
    </div>
  );
}