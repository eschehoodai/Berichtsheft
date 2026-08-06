import React, { useState } from 'react';
import { Cloud, Copy, Check, RefreshCw, X, ShieldCheck, Smartphone } from 'lucide-react';

interface CloudSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  syncCode: string;
  cloudStatus: 'CONNECTED' | 'SYNCING' | 'OFFLINE';
  onChangeSyncCode: (newCode: string) => Promise<boolean>;
}

export const CloudSyncModal: React.FC<CloudSyncModalProps> = ({
  isOpen,
  onClose,
  syncCode,
  cloudStatus,
  onChangeSyncCode
}) => {
  const [inputCode, setInputCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(syncCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConnectNewCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;

    setLoading(true);
    setFeedback(null);
    try {
      const found = await onChangeSyncCode(inputCode.trim());
      if (found) {
        setFeedback('Erfolgreich verbunden! Berichte vom neuen Gerät wurden geladen.');
      } else {
        setFeedback('Neuer Sync-Code gekoppelt. Dieser Code ist ab sofort Ihr gemeinsamer Cloud-Speicher.');
      }
      setInputCode('');
    } catch (err) {
      setFeedback('Fehler beim Koppeln. Bitte prüfen Sie die Verbindung.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-card rounded-2xl max-w-lg w-full p-6 border border-slate-800 space-y-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Geräte-Cloud-Synchronisation</h3>
              <p className="text-xs text-slate-400">Automatische Live-Synchronisation via Firebase</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Indicator */}
        <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span
              className={`w-3 h-3 rounded-full ${
                cloudStatus === 'CONNECTED'
                  ? 'bg-emerald-400 shadow-lg shadow-emerald-500/50 animate-pulse'
                  : cloudStatus === 'SYNCING'
                  ? 'bg-amber-400 animate-spin'
                  : 'bg-rose-400'
              }`}
            />
            <span className="text-xs font-bold text-slate-200">
              {cloudStatus === 'CONNECTED'
                ? 'Live mit Firebase Cloud verbunden'
                : cloudStatus === 'SYNCING'
                ? 'Synchronisiere Daten...'
                : 'Offline (Lokale Speicherung aktiv)'}
            </span>
          </div>
          <span className="text-[10px] font-semibold uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
            Dauerhaft Kostenlos
          </span>
        </div>

        {/* Current Device Code */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
            Ihr aktueller Geräte-Sync-Code:
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-slate-950 px-4 py-3 rounded-xl border border-blue-500/40 text-center font-mono font-extrabold text-xl text-amber-400 tracking-widest shadow-inner">
              {syncCode}
            </div>
            <button
              onClick={handleCopy}
              className="px-4 py-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-bold flex items-center gap-1.5 transition shrink-0"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Kopiert!' : 'Kopieren'}</span>
            </button>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Geben Sie diesen Code auf Ihrem Handy oder einem zweiten Laptop ein, um sich mit denselben Daten zu verbinden.
          </p>
        </div>

        {/* Form to connect another device */}
        <form onSubmit={handleConnectNewCode} className="space-y-3 pt-3 border-t border-slate-800">
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Smartphone className="w-4 h-4 text-amber-400" /> Zweites Gerät koppeln:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="z.B. BH-684920"
              className="flex-1 bg-slate-950 text-xs text-white px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500 font-mono tracking-wider placeholder:text-slate-600 uppercase"
            />
            <button
              type="submit"
              disabled={!inputCode.trim() || loading}
              className="px-4 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 disabled:opacity-40 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shrink-0 shadow-md shadow-blue-500/20"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
              <span>Koppeln</span>
            </button>
          </div>
          {feedback && (
            <p className="text-xs text-emerald-400 font-medium bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20">
              {feedback}
            </p>
          )}
        </form>

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
};
