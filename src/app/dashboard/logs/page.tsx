import { requireAuth } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase-server";
import { Shield, Clock, Globe, User as UserIcon } from "lucide-react";

export default async function AuditLogsPage() {
  const session = await requireAuth();

  // Optimized fetching using Supabase Data API (HTTPS Port 443)
  // This fetches security events for the current user.
  const { data: logs, error } = await supabaseAdmin
    .from('AuditLog')
    .select('*')
    .eq('userId', session.user.id)
    .order('timestamp', { ascending: false });

  if (error) {
    console.error("Error fetching audit logs:", error);
  }

  return (
    <div className="space-y-8 p-8 min-h-screen bg-[var(--background)]">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-theme-black tracking-tight flex items-center gap-3">
          <Shield className="w-8 h-8 text-theme-dark" />
          Security Audit Logs
        </h1>
        <p className="text-theme-dark">
          Review immutable records of all project and file operations for your account.
        </p>
      </div>

      <div className="bg-theme-white border border-theme-light rounded-3xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-theme-light/30 border-b border-theme-light">
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-theme-dark">Timestamp</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-theme-dark">Action / Event</th>
                <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-theme-dark">Metadata</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-theme-light/50">
              {!logs || logs.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-theme-mid italic">
                    No security events recorded yet.
                  </td>
                </tr>
              ) : (
                logs.map((log: any) => (
                  <tr key={log.id} className="hover:bg-theme-light/10 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-theme-black font-semibold text-sm">
                        <Clock className="w-3.5 h-3.5 text-theme-mid" />
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-theme-dark font-medium leading-relaxed">
                        {log.action}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 text-[10px] text-theme-mid font-black uppercase tracking-tighter">
                          <Globe className="w-3 h-3" />
                          IP: {log.ipAddress || "N/A"}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-theme-mid font-black uppercase tracking-tighter truncate max-w-[200px]">
                          <UserIcon className="w-3 h-3" />
                          {log.userAgent || "System"}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="p-6 bg-theme-light/10 border border-theme-light rounded-2xl">
        <p className="text-xs text-theme-mid flex items-center gap-2">
          <Shield className="w-3.5 h-3.5" />
          <strong>Compliance Note:</strong> Audit logs are generated automatically for every write operation and cannot be modified or deleted by users.
        </p>
      </div>
    </div>
  );
}
