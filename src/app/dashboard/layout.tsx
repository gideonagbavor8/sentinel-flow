import { ReactNode } from "react";
import Sidebar from "@/app/dashboard/sidebar";
import { requireAuth } from "@/lib/session";
import prisma from "@/lib/prisma";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await requireAuth();

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { email: true, role: true }
  });

  return (
    <div className="flex h-screen bg-[var(--background)]">
      <Sidebar userEmail={user?.email} userRole={user?.role} />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}


