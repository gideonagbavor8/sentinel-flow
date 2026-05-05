import { requireAuth } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase-server";

export default async function SettingsPage() {
  const session = await requireAuth();
  
  // Optimized: Use HTTPS Data API to avoid connection timeouts
  const { data: user, error } = await supabaseAdmin
    .from('User')
    .select('*')
    .eq('id', session.user.id)
    .single();

  if (error || !user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-8 min-h-screen bg-[var(--background)]">
      <div>
        <h1 className="text-3xl font-bold text-theme-black mb-2 tracking-tight">Account Settings</h1>
        <p className="text-theme-dark">Manage your profile and security preferences.</p>
      </div>

      <div className="bg-theme-white border border-theme-light rounded-3xl p-8 shadow-lg">
        <h2 className="text-xl font-bold text-theme-black mb-6">Profile Information</h2>
        
        <div className="space-y-6 max-w-md">
          <div>
            <label className="block text-sm font-bold text-theme-mid mb-2 uppercase tracking-wider">Email Address</label>
            <div className="bg-theme-light/20 border border-theme-light text-theme-black rounded-xl px-4 py-3 font-medium">
              {user.email}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-theme-mid mb-2 uppercase tracking-wider">Account ID</label>
            <div className="bg-theme-light/20 border border-theme-light text-theme-dark rounded-xl px-4 py-3 font-mono text-xs break-all">
              {user.id}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-theme-white border border-theme-light rounded-3xl p-8 shadow-lg">
        <h2 className="text-xl font-bold text-theme-black mb-6">Security</h2>
        <p className="text-theme-dark mb-4">Password management and security features will appear here.</p>
        <button 
          disabled
          className="px-6 py-2.5 bg-theme-light text-theme-mid rounded-xl cursor-not-allowed text-sm font-bold uppercase tracking-widest"
        >
          Change Password (Coming Soon)
        </button>
      </div>
    </div>
  );
}
