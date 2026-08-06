import React, { useState } from 'react';
import { Calendar as CalendarIcon, CheckCircle2, Clock, AlertTriangle, Edit3, Search, Filter, Award } from 'lucide-react';
import type { Wochenbericht, ReportStatus } from '../../types/report';
import { generateAll156Weeks } from '../../utils/dateUtils';

interface CalendarOverviewProps {
  reports: Wochenbericht[];
  selectedWeekId: string;
  onSelectWeek: (weekId: string) => void;
}

export const CalendarOverview: React.FC<CalendarOverviewProps> = ({
  reports,
  selectedWeekId,
  onSelectWeek
}) => {
  const [activeYear, setActiveYear] = useState<1 | 2 | 3 | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<ReportStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const allWeeks = generateAll156Weeks();

  // Map of reports by week ID
  const reportMap = new Map<string, Wochenbericht>();
  reports.forEach((r) => reportMap.set(r.id, r));

  const filteredWeeks = allWeeks.filter((w) => {
    // Year filter
    if (activeYear !== 'ALL' && w.ausbildungsjahr !== activeYear) return false;

    // Status filter
    const report = reportMap.get(w.id);
    const status = report ? report.status : 'DRAFT';
    if (statusFilter !== 'ALL' && status !== statusFilter) return false;

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchKW = `kw ${w.kalenderwoche}`.includes(q) || `kw${w.kalenderwoche}`.includes(q);
      const matchYear = w.jahr.toString().includes(q);
      const matchLabel = w.label.toLowerCase().includes(q);
      return matchKW || matchYear || matchLabel;
    }

    return true;
  });

  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">
            <CheckCircle2 className="w-3 h-3" /> Genehmigt
          </span>
        );
      case 'SUBMITTED':
        return (
          <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 font-semibold">
            <Clock className="w-3 h-3" /> Eingereicht
          </span>
        );
      case 'REJECTED':
        return (
          <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 font-semibold">
            <AlertTriangle className="w-3 h-3" /> Korrektur
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 font-medium">
            <Edit3 className="w-3 h-3" /> Entwurf
          </span>
        );
    }
  };

  const getYearSummary = (year: 1 | 2 | 3) => {
    const yearWeeks = allWeeks.filter((w) => w.ausbildungsjahr === year);
    const approvedCount = yearWeeks.filter((w) => reportMap.get(w.id)?.status === 'APPROVED').length;
    const submittedCount = yearWeeks.filter((w) => reportMap.get(w.id)?.status === 'SUBMITTED').length;
    return { total: yearWeeks.length, approved: approvedCount, submitted: submittedCount };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Overview Banner */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Award className="w-4 h-4" /> 3-Jahres Ausbildungsübersicht
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Fachkraft Küche (01.08.2026 – 31.07.2029)
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Insgesamt 156 Kalenderwochen Ausbildungsnachweis nach BBiG § 13 & § 14. Wählen Sie eine Kalenderwoche zur Bearbeitung oder Freigabe aus.
            </p>
          </div>

          {/* Year stats grid */}
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((y) => {
              const summary = getYearSummary(y as 1 | 2 | 3);
              return (
                <button
                  key={y}
                  onClick={() => setActiveYear(y as 1 | 2 | 3)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    activeYear === y
                      ? 'bg-amber-500/10 border-amber-500/50 shadow-lg shadow-amber-500/10'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs text-slate-400 font-medium">{y}. Ausbildungsjahr</div>
                  <div className="text-lg font-bold text-white mt-0.5">
                    {summary.approved} <span className="text-xs font-normal text-slate-500">/ {summary.total} WK</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${(summary.approved / summary.total) * 100}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-card p-4 rounded-xl border border-slate-800">
        {/* Year Filter Tabs */}
        <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveYear('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeYear === 'ALL'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            Alle 156 Wochen
          </button>
          <button
            onClick={() => setActiveYear(1)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeYear === 1
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            1. Jahr (KW 31/26 - KW 30/27)
          </button>
          <button
            onClick={() => setActiveYear(2)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeYear === 2
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            2. Jahr (KW 31/27 - KW 30/28)
          </button>
          <button
            onClick={() => setActiveYear(3)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
              activeYear === 3
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            3. Jahr (KW 31/28 - KW 30/29)
          </button>
        </div>

        {/* Status Filter & Search */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-48">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="KW oder Datum suchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 text-xs text-slate-200 placeholder-slate-500 pl-9 pr-3 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-amber-500/50"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900 px-2 py-1.5 rounded-lg border border-slate-800">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ReportStatus | 'ALL')}
              className="bg-transparent text-xs text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900 text-slate-300">Alle Status</option>
              <option value="DRAFT" className="bg-slate-900 text-slate-300">Entwurf</option>
              <option value="SUBMITTED" className="bg-slate-900 text-slate-300">Eingereicht</option>
              <option value="APPROVED" className="bg-slate-900 text-slate-300">Genehmigt</option>
              <option value="REJECTED" className="bg-slate-900 text-slate-300">Korrektur</option>
            </select>
          </div>
        </div>
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredWeeks.map((week) => {
          const report = reportMap.get(week.id);
          const status = report ? report.status : 'DRAFT';
          const isSelected = selectedWeekId === week.id;

          return (
            <button
              key={week.id}
              onClick={() => onSelectWeek(week.id)}
              className={`p-4 rounded-xl border text-left transition-all duration-200 group relative overflow-hidden ${
                isSelected
                  ? 'bg-slate-900 border-amber-500 ring-2 ring-amber-500/20 shadow-lg shadow-amber-500/10'
                  : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/90'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  Woche #{week.index}
                </span>
                {getStatusBadge(status)}
              </div>

              <h3 className="font-bold text-white text-base group-hover:text-amber-300 transition">
                KW {week.kalenderwoche} / {week.jahr}
              </h3>

              <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                <CalendarIcon className="w-3.5 h-3.5 text-slate-500" />
                <span>{week.startDate.split('-').reverse().join('.').slice(0, 6)} – {week.endDate.split('-').reverse().join('.')}</span>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span className="text-slate-500 font-medium">
                  {week.ausbildungsjahr}. Ausbildungsjahr
                </span>
                <span className="font-semibold text-slate-300">
                  {report ? `${report.gesamtStunden || 40} Std.` : '40 Std.'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {filteredWeeks.length === 0 && (
        <div className="text-center py-12 glass-card rounded-2xl border border-slate-800">
          <CalendarIcon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">Keine Kalenderwochen gefunden</h3>
          <p className="text-sm text-slate-400 max-w-sm mx-auto mt-1">
            Versuchen Sie, den Filter zurückzusetzen oder die Suchanfrage zu verändern.
          </p>
        </div>
      )}
    </div>
  );
};
