"use client";

import { useState } from "react";
import { ShieldCheck, ShieldAlert, Loader2, QrCode, ArrowRight } from "lucide-react";
import { generateMfaSecret, enableMfa, disableMfa } from "./actions";

export default function MfaSettings({ isEnabled }: { isEnabled: boolean }) {
  const [loading, setLoading] = useState(false);
  const [setupData, setSetupData] = useState<{ secret: string; qrCodeUrl: string } | null>(null);
  const [token, setToken] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleStartSetup() {
    setLoading(true);
    setError(null);
    try {
      const data = await generateMfaSecret();
      setSetupData(data);
    } catch (err: any) {
      setError(err.message || "Failed to start MFA setup.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyAndEnable() {
    if (token.length !== 6) return;
    setLoading(true);
    setError(null);
    try {
      await enableMfa(token, setupData!.secret);
      setSetupData(null);
      setToken("");
    } catch (err: any) {
      setError(err.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDisable() {
    if (!confirm("Are you sure you want to disable Multi-Factor Authentication? Your account will be less secure.")) return;
    setLoading(true);
    try {
      await disableMfa();
    } catch (err: any) {
      setError(err.message || "Failed to disable MFA.");
    } finally {
      setLoading(false);
    }
  }

  if (isEnabled) {
    return (
      <div className="p-8 rounded-3xl bg-theme-white border border-theme-light shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 rounded-2xl bg-theme-dark text-theme-white">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-theme-black">MFA Protection is Active</h3>
            <p className="text-theme-mid font-medium">Your account is currently secured with Multi-Factor Authentication.</p>
          </div>
        </div>

        <button
          onClick={handleDisable}
          disabled={loading}
          className="px-6 py-2.5 rounded-xl border-2 border-theme-light text-theme-dark font-bold hover:bg-theme-light/30 transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          Disable MFA
        </button>
      </div>
    );
  }

  if (setupData) {
    return (
      <div className="p-8 rounded-3xl bg-theme-white border-2 border-theme-dark shadow-xl animate-in fade-in zoom-in duration-300">
        <h3 className="text-2xl font-bold text-theme-black mb-6">Setup Multi-Factor Authentication</h3>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col items-center gap-6 p-6 bg-theme-light/10 rounded-2xl border border-theme-light">
            <img src={setupData.qrCodeUrl} alt="MFA QR Code" className="w-48 h-48 rounded-lg shadow-inner bg-white p-2" />
            <p className="text-xs text-center text-theme-mid font-mono break-all max-w-[200px]">
              Secret: {setupData.secret}
            </p>
          </div>

          <div className="space-y-6">
            <p className="text-theme-dark font-medium leading-relaxed">
              Scan the QR code with your authenticator app (like Google Authenticator or Authy) and enter the 6-digit verification code below.
            </p>

            <div className="space-y-2">
              <label className="text-sm font-black uppercase tracking-widest text-theme-mid">Verification Code</label>
              <input
                type="text"
                placeholder="000000"
                maxLength={6}
                value={token}
                onChange={(e) => setToken(e.target.value.replace(/\D/g, ""))}
                className="w-full px-6 py-4 bg-theme-light/20 border-2 border-theme-light focus:border-theme-dark rounded-2xl text-3xl font-black tracking-[0.5em] text-center transition-all outline-none"
              />
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-theme-dark text-theme-white text-sm font-bold flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" />
                {error}
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button
                onClick={handleVerifyAndEnable}
                disabled={loading || token.length !== 6}
                className="w-full py-4 bg-theme-dark text-theme-white rounded-2xl font-bold hover:bg-theme-black transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                Complete MFA Setup
              </button>
              <button
                onClick={() => setSetupData(null)}
                className="w-full py-2 text-theme-mid font-bold hover:text-theme-dark transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 rounded-3xl bg-theme-white border border-theme-light shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-theme-light/50 text-theme-mid">
            <QrCode className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-theme-black">Multi-Factor Authentication</h3>
            <p className="text-theme-mid font-medium">Add an extra layer of security to your account.</p>
          </div>
        </div>

        <button
          onClick={handleStartSetup}
          disabled={loading}
          className="px-6 py-3 bg-theme-dark text-theme-white rounded-xl font-bold hover:bg-theme-black transition-all flex items-center gap-2 group"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
          Enable MFA
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
      
      {error && (
        <div className="mt-4 p-4 rounded-xl bg-theme-dark text-theme-white text-sm font-bold">
          {error}
        </div>
      )}
    </div>
  );
}
