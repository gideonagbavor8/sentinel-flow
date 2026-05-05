import { ReactNode } from "react";
import Sidebar from "@/app/dashboard/sidebar";
import { requireAuth } from "@/lib/session";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await requireAuth();

  // Optimized: Use session data instead of making an extra database call
  // This prevents the dashboard from hanging if the database connection is slow.
  return (
    <div className="flex h-screen bg-[var(--background)]">
      <Sidebar userEmail={session.user.email} userRole={session.user.role} />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
