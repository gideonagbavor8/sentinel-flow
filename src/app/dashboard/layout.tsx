import { ReactNode } from "react";
import Sidebar from "@/app/dashboard/sidebar";
import { requireAuth } from "@/lib/session";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  await requireAuth();

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8" style={{ backgroundColor: 'var(--primary)' }}>
        {children}
      </main>
    </div>
  );
}


