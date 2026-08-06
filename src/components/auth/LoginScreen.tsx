import React, { useState } from 'react';
import { ChefHat, Lock, User as UserIcon, Eye, EyeOff, LogIn, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { loginWithUserCredentials, registerWithUserCredentials } from '../../db/firebase';

interface LoginScreenProps {
  onLoginSuccess: (userEmail: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // Quick fill preset credentials requested by user
  const handleQuickFillPreset = () => {
    setUsernameInput('eschehood44');
    setPasswordInput('Klack1996,,');
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim() || !passwordInput.trim()) {
      setErrorMsg('Bitte geben Sie Benutzer-ID / E-Mail und Passwort ein.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      if (isRegisterMode) {
        const u = await registerWithUserCredentials(usernameInput, passwordInput);
        onLoginSuccess(u.email || usernameInput);
      } else {
        const u = await loginWithUserCredentials(usernameInput, passwordInput);
        onLoginSuccess(u.email || usernameInput);
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setErrorMsg('Falsches Passwort oder ungültiges Login. Bitte prüfen Sie Ihre Eingaben.');
      } else if (err.code === 'auth/email-already-in-use') {
        setErrorMsg('Diese ID / E-Mail ist bereits registriert. Bitte nutzen Sie "Anmelden".');
      } else if (err.code === 'auth/weak-password') {
        setErrorMsg('Das Passwort ist zu kurz. Bitte mindestens 6 Zeichen wählen.');
      } else {
        setErrorMsg(err.message || 'Anmeldung fehlgeschlagen. Bitte erneut versuchen.');
      }
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
          <p className="text-xs text-slate-400">
            Bitte melden Sie sich an, um Zugriff auf Ihre Wochenberichte und Cloud-Synchronisation zu erhalten.
          </p>
        </div>

        {/* Quick Fill Preset Chip */}
        <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center space-y-1.5">
          <span className="text-[11px] font-bold text-amber-300 flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Ihre gespeicherten Login-Daten:
          </span>
          <button
            type="button"
            onClick={handleQuickFillPreset}
            className="w-full bg-slate-900/90 hover:bg-slate-800 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold py-2 px-3 rounded-xl transition flex items-center justify-center gap-2"
          >
            <span>ID: <strong className="text-white">eschehood44</strong></span>
            <span className="text-slate-600">•</span>
            <span>PW: <strong className="text-white">Klack1996,,</strong></span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-1" />
          </button>
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
                placeholder="z.B. eschehood44"
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
                required
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
                <span>{isRegisterMode ? 'Konto erstellen & Anmelden' : 'Anmelden'}</span>
              </>
            )}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="pt-2 text-center border-t border-slate-800">
          <button
            type="button"
            onClick={() => {
              setIsRegisterMode(!isRegisterMode);
              setErrorMsg(null);
            }}
            className="text-xs text-slate-400 hover:text-amber-400 transition"
          >
            {isRegisterMode
              ? 'Bereits ein Konto? Hier anmelden'
              : 'Noch kein Konto? Erstes Konto erstellen'}
          </button>
        </div>

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Verschlüsselte & geschützte Verbindung</span>
        </div>
      </div>
    </div>
  );
};
