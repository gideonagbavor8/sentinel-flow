import { ReactNode } from "react";
import Sidebar from "@/app/dashboard/sidebar";
import { requireAuth } from "@/lib/session";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  await requireAuth();

  return (
    <div className="flex h-screen bg-[#0f172a]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}


