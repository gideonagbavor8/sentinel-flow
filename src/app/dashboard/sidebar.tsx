"use client"; // Required for usePathname

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Files,
  FolderTree,
  History,
  Settings,
  ShieldCheck,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Files", href: "/dashboard/files", icon: Files },
  { name: "Projects", href: "/dashboard/projects", icon: FolderTree },
  { name: "Audit Logs", href: "/dashboard/logs", icon: History },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar({ userEmail, userRole }: { userEmail?: string; userRole?: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  }

  return (
    <aside className="w-64 flex flex-col h-screen border-r border-slate-800 bg-[#0f172a] text-slate-300">
      <div className="p-6 flex items-center gap-3">
        <div className="p-2 rounded-xl bg-indigo-600/20 ring-1 ring-indigo-500/50">
          <ShieldCheck className="w-6 h-6 text-indigo-400" />
        </div>
        <span className="font-bold text-xl tracking-tight text-white">Sentinel Flow</span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group relative overflow-hidden",
                isActive
                  ? "bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)]"
                  : "hover:bg-slate-800/50 hover:text-white"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 transition-colors",
                isActive ? "text-white" : "text-slate-400 group-hover:text-white"
              )} />
              <span className="text-sm font-semibold">{item.name}</span>

              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center justify-between px-3 py-3 rounded-2xl bg-slate-800/30 border border-slate-700/30">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 shrink-0 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-black text-white shadow-lg ring-2 ring-indigo-500/20 uppercase">
              {userEmail ? userEmail.substring(0, 2) : "US"}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate text-white">{userEmail || "User"}</p>
              <p className="text-xs truncate text-slate-500 font-medium capitalize">{userRole?.toLowerCase() || "Client"}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            title="Sign out"
            className="p-2 shrink-0 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </aside>
  );
}