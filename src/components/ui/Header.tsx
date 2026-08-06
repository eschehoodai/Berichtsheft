import React from 'react';
import { ChefHat, Calendar, FileText, ShieldCheck, Download, Settings, Cloud, LogOut, User as UserIcon } from 'lucide-react';
import type { AppProfile } from '../../types/report';

interface HeaderProps {
  profile?: AppProfile;
  activeTab: 'calendar' | 'editor' | 'export';
  setActiveTab: (tab: 'calendar' | 'editor' | 'export') => void;
  onOpenProfile: () => void;
  onOpenBatchExport: () => void;
  onOpenCloudSync?: () => void;
  onLogout?: () => void;
  currentUserEmail?: string | null;
  syncCode?: string;
  cloudStatus?: 'CONNECTED' | 'SYNCING' | 'OFFLINE';
  approvedCount: number;
  totalWeeks: number;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  activeTab,
  setActiveTab,
  onOpenProfile,
  onOpenBatchExport,
  onOpenCloudSync,
  onLogout,
  currentUserEmail,
  syncCode,
  cloudStatus = 'CONNECTED',
  approvedCount,
  totalWeeks
}) => {
  const percentApproved = Math.round((approvedCount / totalWeeks) * 100) || 0;
  const displayUser = currentUserEmail ? currentUserEmail.split('@')[0] : null;

  return (
    <header className="sticky top-0 z-40 glass-nav px-4 py-3 border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Trainee Info */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-bold">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white tracking-tight">IHK Berichtsheft</h1>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-medium">
                  Fachkraft Küche
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-2">
                <span>{profile?.traineeName || 'Ausbildungsnachweis'}</span>
                <span className="text-slate-600">•</span>
                <span>01.08.2026 – 31.07.2029</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            {onOpenCloudSync && (
              <button
                onClick={onOpenCloudSync}
                className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center gap-1 text-xs font-bold"
                title="Cloud Sync"
              >
                <Cloud className="w-4 h-4" />
              </button>
            )}
            {onLogout && (
              <button
                onClick={onLogout}
                className="p-2 rounded-lg bg-slate-800 text-rose-400 border border-slate-700 hover:bg-rose-500/10"
                title="Abmelden"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onOpenProfile}
              className="p-2 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700"
              title="Profil & Einstellungen"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800/80 w-full md:w-auto justify-center">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all ${
              activeTab === 'calendar'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>156 Wochen</span>
          </button>

          <button
            onClick={() => setActiveTab('editor')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all ${
              activeTab === 'editor'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Wochenbericht</span>
          </button>

          <button
            onClick={() => setActiveTab('export')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all ${
              activeTab === 'export'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>IHK PDF-Export</span>
          </button>
        </nav>

        {/* Right Stats & Profile Desktop */}
        <div className="hidden md:flex items-center gap-3">
          {/* User Badge */}
          {displayUser && (
            <div className="flex items-center gap-1.5 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/30 text-xs font-bold text-amber-300">
              <UserIcon className="w-3.5 h-3.5" />
              <span>{displayUser}</span>
            </div>
          )}

          {/* Cloud Sync Button */}
          {onOpenCloudSync && (
            <button
              onClick={onOpenCloudSync}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/30 hover:bg-blue-500/20 transition text-xs font-semibold"
              title={`Cloud-Sync Aktiv (Code: ${syncCode || ''})`}
            >
              <Cloud className={`w-4 h-4 ${cloudStatus === 'CONNECTED' ? 'text-emerald-400' : 'text-amber-400 animate-spin'}`} />
              <span>Cloud Sync</span>
            </button>
          )}

          <div className="flex items-center gap-2.5 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <div className="text-xs">
              <span className="text-slate-400">Genehmigt: </span>
              <span className="font-bold text-emerald-400">{approvedCount} / {totalWeeks}</span>
              <span className="text-slate-500 ml-1">({percentApproved}%)</span>
            </div>
          </div>

          <button
            onClick={onOpenBatchExport}
            className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition"
          >
            <Download className="w-4 h-4" />
            <span>Gesamtexport</span>
          </button>

          <button
            onClick={onOpenProfile}
            className="p-2 rounded-lg bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600 transition"
            title="Stammdaten & IHK Profileinstellungen"
          >
            <Settings className="w-5 h-5" />
          </button>

          {onLogout && (
            <button
              onClick={onLogout}
              className="p-2 rounded-lg bg-slate-800 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 border border-slate-700 transition"
              title="Abmelden"
            >
              <LogOut className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};


