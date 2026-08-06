import React from 'react';
import { GraduationCap, Plus, Trash2, Clock, Building2 } from 'lucide-react';
import type { BerufsschulTag } from '../../types/report';

interface SchoolDayFormProps {
  schoolDays: BerufsschulTag[];
  onChangeSchoolDays: (days: BerufsschulTag[]) => void;
  isCombinedMode?: boolean;
  onToggleCombinedMode?: (combined: boolean) => void;
  isReadOnly?: boolean;
}

export const SchoolDayForm: React.FC<SchoolDayFormProps> = ({
  schoolDays,
  onChangeSchoolDays,
  isCombinedMode = false,
  onToggleCombinedMode,
  isReadOnly = false
}) => {
  const handleUpdateDay = (index: number, field: keyof BerufsschulTag, value: any) => {
    const updated = [...schoolDays];
    updated[index] = { ...updated[index], [field]: value };
    onChangeSchoolDays(updated);
  };

  const handleAddDay = () => {
    const newDay: BerufsschulTag = {
      date: new Date().toISOString().split('T')[0],
      dayOfWeek: 'Schultag',
      fach: 'Unterricht',
      thema: '',
      stunden: 8
    };
    onChangeSchoolDays([...schoolDays, newDay]);
  };

  const handleRemoveDay = (index: number) => {
    const updated = schoolDays.filter((_, i) => i !== index);
    onChangeSchoolDays(updated);
  };

  return (
    <div className="space-y-6">
      {/* Combined mode checkbox toggle */}
      {!isReadOnly && onToggleCombinedMode && (
        <div className="glass-card p-4 rounded-2xl border border-blue-500/30 bg-blue-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Waren Sie in dieser Schulwoche auch im Betrieb?</h4>
              <p className="text-xs text-slate-400">
                Aktivieren Sie die Option, um zusätzlich Betriebstage/Wochenendarbeit im Bericht & PDF anzuzeigen.
              </p>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none bg-slate-900 px-4 py-2 rounded-xl border border-slate-700 hover:border-blue-400 transition shrink-0">
            <input
              type="checkbox"
              checked={isCombinedMode}
              onChange={(e) => onToggleCombinedMode(e.target.checked)}
              className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-blue-500 focus:ring-blue-500 cursor-pointer"
            />
            <span className="text-xs font-bold text-blue-300">
              {isCombinedMode ? 'Berufsschule + Betrieb (Aktiv)' : 'Reine Berufsschulwoche'}
            </span>
          </label>
        </div>
      )}

      {/* School Days Section */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Berufsschulunterricht (Tagesberichte)</h3>
              <p className="text-xs text-slate-400">
                Tägliche Erfassung der Unterrichtsfächer und behandelten Themen (Montag – Freitag)
              </p>
            </div>
          </div>

          {!isReadOnly && (
            <button
              onClick={handleAddDay}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border border-blue-500/30 text-xs font-semibold transition"
            >
              <Plus className="w-4 h-4" /> Schultag hinzufügen
            </button>
          )}
        </div>

        <div className="space-y-4">
          {schoolDays.map((day, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4 hover:border-slate-700 transition"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                {/* Wochentag / Datum */}
                <div className="md:col-span-3">
                  <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">
                    Tag / Datum
                  </label>
                  <input
                    type="text"
                    disabled={isReadOnly}
                    value={day.dayOfWeek}
                    onChange={(e) => handleUpdateDay(idx, 'dayOfWeek', e.target.value)}
                    placeholder="z.B. Montag"
                    className="w-full bg-slate-950 text-xs text-slate-200 px-3 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-blue-500/50 disabled:opacity-60 font-medium"
                  />
                </div>

                {/* Fach */}
                <div className="md:col-span-6">
                  <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">
                    Unterrichtsfach / Bereich
                  </label>
                  <input
                    type="text"
                    disabled={isReadOnly}
                    value={day.fach || ''}
                    onChange={(e) => handleUpdateDay(idx, 'fach', e.target.value)}
                    placeholder="z.B. Fachtheorie, Wirtschaftskunde, Speisenkunde..."
                    className="w-full bg-slate-950 text-xs text-slate-200 px-3 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-blue-500/50 disabled:opacity-60"
                  />
                </div>

                {/* Stunden */}
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" /> Std.
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    disabled={isReadOnly}
                    value={day.stunden}
                    onChange={(e) => handleUpdateDay(idx, 'stunden', Number(e.target.value))}
                    className="w-full bg-slate-950 text-xs text-slate-200 px-3 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-blue-500/50 text-center font-bold disabled:opacity-60"
                  />
                </div>

                {/* Remove button */}
                {!isReadOnly && schoolDays.length > 1 && (
                  <div className="md:col-span-1 flex justify-end">
                    <button
                      onClick={() => handleRemoveDay(idx)}
                      className="p-2 rounded-lg text-rose-400 hover:bg-rose-500/10 transition"
                      title="Schultag entfernen"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Thema / Unterrichtsinhalt */}
              <div>
                <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">
                  Unterrichtsinhalt / Thema (Freitext)
                </label>
                <textarea
                  rows={2}
                  disabled={isReadOnly}
                  value={day.thema}
                  onChange={(e) => handleUpdateDay(idx, 'thema', e.target.value)}
                  placeholder="Genaue Beschreibung der behandelten Themen im Unterricht..."
                  className="w-full bg-slate-950 text-xs text-slate-200 px-3 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-blue-500/50 disabled:opacity-60"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
