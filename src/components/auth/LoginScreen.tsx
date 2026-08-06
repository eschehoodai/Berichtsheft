import React, { useState } from 'react';
import { ChefHat, Lock, User as UserIcon, Eye, EyeOff, LogIn, ShieldCheck, Server } from 'lucide-react';
import { loginWithLocalCredentials } from '../../db/auth';

interface LoginScreenProps {
  onLoginSuccess: (userEmail: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) {
      setErrorMsg('Bitte geben Sie Ihre Benutzer-ID oder E-Mail ein.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const u = await loginWithLocalCredentials(usernameInput, passwordInput);
      onLoginSuccess(u.email || usernameInput);
    } catch (err: any) {
      console.error('Auth error:', err);
      setErrorMsg(err.message || 'Anmeldung fehlgeschlagen. Bitte erneut versuchen.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Background Glow Accents */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full glass-card p-8 rounded-3xl border border-slate-800 shadow-2xl relative z-10 space-y-6">
        {/* App Logo & Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center mx-auto shadow-xl shadow-amber-500/20 text-slate-950">
            <ChefHat className="w-9 h-9" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">IHK Berichtsheft</h1>
            <p className="text-xs text-amber-400 font-semibold mt-0.5">Fachkraft Küche (BBiG § 13 & 14)</p>
          </div>
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-semibold text-emerald-400">
            <Server className="w-3.5 h-3.5" />
            <span>Lokaler / Self-Hosted Modus</span>
          </div>

          <p className="text-xs text-slate-400">
            Melden Sie sich an, um Zugriff auf Ihre lokalen Wochenberichte zu erhalten.
          </p>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* User ID / Email Input */}
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase text-slate-400">
              Benutzer-ID / E-Mail
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <UserIcon className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="Benutzer-ID oder E-Mail"
                className="w-full bg-slate-950 text-xs text-slate-100 pl-10 pr-3.5 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500 transition font-medium"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1">
            <label className="block text-xs font-bold uppercase text-slate-400">
              Passwort
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 text-xs text-slate-100 pl-10 pr-10 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500 transition font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition disabled:opacity-50"
          >
            {loading ? (
              <span className="animate-pulse">Anmelden...</span>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Anmelden</span>
              </>
            )}
          </button>
        </form>

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 pt-1 border-t border-slate-800/80">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Lokale & geschützte Offline-Speicherung</span>
        </div>
      </div>
    </div>
  );
};

