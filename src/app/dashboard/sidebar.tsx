"use client"; // Required for usePathname

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Files,
  FolderTree,
  History,
  Settings,
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Files", href: "/dashboard/files", icon: Files },
  { name: "Projects", href: "/dashboard/projects", icon: FolderTree },
  { name: "Audit Logs", href: "/dashboard/logs", icon: History },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 flex flex-col h-screen border-r" style={{ backgroundColor: 'var(--secondary)', borderColor: 'var(--primary)', color: '#1e293b' }}>
      <div className="p-6 flex items-center gap-3">
        <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--primary)' }}>
          <ShieldCheck className="w-6 h-6" style={{ color: '#475569' }} />
        </div>
        <span className="font-bold text-xl tracking-tight" style={{ color: '#0f172a' }}>Sentinel Flow</span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 group",
                isActive
                  ? "shadow-lg"
                  : "hover:opacity-70"
              )}
              style={isActive ? { backgroundColor: 'var(--primary)', color: '#0f172a' } : { backgroundColor: 'transparent', color: '#334155' }}
            >
              <item.icon className="w-5 h-5" style={{ color: isActive ? '#0f172a' : '#475569' }} />
              <span className="text-sm font-medium">{item.name}</span>

              {/* Optional: Indicator dot for active state */}
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#0f172a' }} />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t" style={{ borderColor: 'var(--primary)' }}>
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: 'var(--primary)', color: '#0f172a' }}>
            GK
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium truncate" style={{ color: '#0f172a' }}>Gideon Komla</p>
            <p className="text-xs truncate text-nowrap" style={{ color: '#64748b' }}>Security Lead</p>
          </div>
        </div>
      </div>
    </aside>
  );
}