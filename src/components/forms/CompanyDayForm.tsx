import React, { useState } from 'react';
import { UtensilsCrossed, ShieldAlert, Plus, Trash2, Clock, CheckSquare, Zap, X, FileText, Layers } from 'lucide-react';
import type { BetrieblicheTaetigkeit } from '../../types/report';

interface CompanyDayFormProps {
  activities: BetrieblicheTaetigkeit[];
  onChange: (activities: BetrieblicheTaetigkeit[]) => void;
  customTemplates?: string[];
  onAddTemplate?: (text: string) => void;
  onRemoveTemplate?: (text: string) => void;
  isReadOnly?: boolean;
}

export const CompanyDayForm: React.FC<CompanyDayFormProps> = ({
  activities = [],
  onChange,
  customTemplates = [],
  onAddTemplate,
  onRemoveTemplate,
  isReadOnly = false
}) => {
  const [schnellwahlInput, setSchnellwahlInput] = useState('');
  const [focusedActivityIndex, setFocusedActivityIndex] = useState(0);

  // Ensure safe fallback if array is empty
  const safeActivities = activities.length > 0 ? activities : [
    {
      id: `weekly-default`,
      date: new Date().toISOString().split('T')[0],
      dayOfWeek: 'Montag – Sonntag (Gesamte Woche)',
      beschreibung: '',
      stunden: 40,
      bezugAusbildungsrahmenplan: '§ 4 Abs. 2',
      haccpHygieneNotice: true,
      arbeitssicherheitNotice: true
    }
  ];

  const isSingleWeeklySummary = safeActivities.length === 1 && (
    safeActivities[0].dayOfWeek.includes('Montag') || safeActivities[0].dayOfWeek.includes('Woche')
  );

  const handleUpdateActivity = (index: number, field: keyof BetrieblicheTaetigkeit, value: any) => {
    const updated = [...safeActivities];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const handleAddActivity = () => {
    const newAct: BetrieblicheTaetigkeit = {
      id: `act-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      dayOfWeek: 'Betriebstag',
      beschreibung: '',
      stunden: 8,
      bezugAusbildungsrahmenplan: '§ 4 Abs. 2',
      haccpHygieneNotice: true,
      arbeitssicherheitNotice: true
    };
    onChange([...safeActivities, newAct]);
  };

  const handleRemoveActivity = (index: number) => {
    const updated = safeActivities.filter((_, i) => i !== index);
    onChange(updated);
  };

  const switchToDailyEntries = () => {
    const days = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];
    const currentText = safeActivities[0]?.beschreibung || '';
    const newActs: BetrieblicheTaetigkeit[] = days.map((d, i) => ({
      id: `act-${Date.now()}-${i}`,
      date: new Date().toISOString().split('T')[0],
      dayOfWeek: d,
      beschreibung: i === 0 ? currentText : (i < 5 ? '' : 'Ruhetag / Frei'),
      stunden: i < 5 ? 8 : 0,
      bezugAusbildungsrahmenplan: '§ 4 Abs. 2',
      haccpHygieneNotice: true,
      arbeitssicherheitNotice: true
    }));
    onChange(newActs);
    setFocusedActivityIndex(0);
  };

  const switchToWeeklySummary = () => {
    const combinedText = safeActivities
      .map((a) => (a.beschreibung.trim() ? `${a.dayOfWeek}: ${a.beschreibung}` : ''))
      .filter(Boolean)
      .join('\n');

    const totalHours = safeActivities.reduce((sum, a) => sum + (a.stunden || 0), 0) || 40;

    const summaryAct: BetrieblicheTaetigkeit = {
      id: `weekly-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      dayOfWeek: 'Montag – Sonntag (Gesamte Woche)',
      beschreibung: combinedText || '',
      stunden: totalHours,
      bezugAusbildungsrahmenplan: '§ 4 Abs. 2',
      haccpHygieneNotice: true,
      arbeitssicherheitNotice: true
    };
    onChange([summaryAct]);
    setFocusedActivityIndex(0);
  };

  const applyTemplate = (text: string) => {
    const targetIdx = focusedActivityIndex < safeActivities.length ? focusedActivityIndex : 0;
    const current = safeActivities[targetIdx]?.beschreibung || '';
    const updatedText = current ? `${current}\n• ${text}` : `• ${text}`;
    handleUpdateActivity(targetIdx, 'beschreibung', updatedText);
  };

  const handleAddSchnellwahl = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (schnellwahlInput.trim() && onAddTemplate) {
      onAddTemplate(schnellwahlInput.trim());
      setSchnellwahlInput('');
    }
  };

  const scrollToSchnellwahl = () => {
    const el = document.getElementById('schnellwahl-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      const inputEl = el.querySelector('input');
      if (inputEl) inputEl.focus();
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800/80 pb-4 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Betriebliche Tätigkeiten & Wochenbericht</h3>
            <p className="text-xs text-slate-400">
              {isSingleWeeklySummary
                ? 'Zusammenfassender Wochenbericht für die gesamte Betriebswoche'
                : 'Detaillierte Tagebucherfassung (Montag – Sonntag)'}
            </p>
          </div>
        </div>

        {!isReadOnly && (
          <div className="flex flex-wrap items-center gap-2">
            {isSingleWeeklySummary ? (
              <button
                onClick={switchToDailyEntries}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold transition"
              >
                <Layers className="w-3.5 h-3.5 text-blue-400" /> In Tagesberichte aufteilen
              </button>
            ) : (
              <button
                onClick={switchToWeeklySummary}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold transition"
              >
                <FileText className="w-3.5 h-3.5 text-amber-400" /> Zu 1 Wochenbericht zusammenfassen
              </button>
            )}

            <button
              onClick={scrollToSchnellwahl}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold transition"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Schnellwahl unten
            </button>

            {!isSingleWeeklySummary && (
              <button
                onClick={handleAddActivity}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/30 text-xs font-semibold transition"
              >
                <Plus className="w-4 h-4" /> Tag hinzufügen
              </button>
            )}
          </div>
        )}
      </div>

      {/* Single Weekly Summary Mode */}
      {isSingleWeeklySummary ? (
        <div className="p-5 rounded-xl bg-slate-900/90 border border-amber-500/30 space-y-4 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center border-b border-slate-800 pb-3">
            <div className="md:col-span-4">
              <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
                Wochenbericht (Montag – Sonntag)
              </span>
            </div>

            <div className="md:col-span-5">
              <label className="block text-[10px] font-semibold uppercase text-slate-400 mb-1">
                Bezug Ausbildungsrahmenplan
              </label>
              <input
                type="text"
                disabled={isReadOnly}
                value={safeActivities[0].bezugAusbildungsrahmenplan || '§ 4 Abs. 2'}
                onChange={(e) => handleUpdateActivity(0, 'bezugAusbildungsrahmenplan', e.target.value)}
                placeholder="z.B. § 4 Abs. 2 Nr. 3"
                className="w-full bg-slate-950 text-xs text-slate-200 px-3 py-1.5 rounded-lg border border-slate-800 focus:outline-none focus:border-amber-500/50"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-[10px] font-semibold uppercase text-slate-400 mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-400" /> Wochenstunden
              </label>
              <input
                type="number"
                min="1"
                max="60"
                disabled={isReadOnly}
                value={safeActivities[0].stunden}
                onChange={(e) => handleUpdateActivity(0, 'stunden', Number(e.target.value))}
                className="w-full bg-slate-950 text-sm text-amber-400 font-bold px-3 py-1 rounded-lg border border-slate-800 text-center"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-white uppercase mb-2">
              Zusammenfassung aller Tätigkeiten, Postenarbeiten & Unterweisungen der Woche
            </label>
            <textarea
              rows={8}
              disabled={isReadOnly}
              value={safeActivities[0].beschreibung}
              onFocus={() => setFocusedActivityIndex(0)}
              onChange={(e) => handleUpdateActivity(0, 'beschreibung', e.target.value)}
              placeholder="Schreiben Sie hier Ihren Wochenbericht für die Betriebswoche (z.B. Selbstständiges Vorbereiten des Postens, Herstellen von Grundsaucen und Brühen, Filetieren von Fisch, Wareneingangskontrolle nach HACCP, Postenreinigung)..."
              className="w-full bg-slate-950 text-xs text-slate-100 p-4 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500 font-mono leading-relaxed shadow-inner"
            />
          </div>

          <div className="flex items-center gap-4 text-xs pt-2">
            <label className="flex items-center gap-2 cursor-pointer select-none text-slate-300">
              <input
                type="checkbox"
                disabled={isReadOnly}
                checked={!!safeActivities[0].haccpHygieneNotice}
                onChange={(e) => handleUpdateActivity(0, 'haccpHygieneNotice', e.target.checked)}
                className="rounded bg-slate-950 border-slate-700 text-amber-500 focus:ring-amber-500"
              />
              <span className="flex items-center gap-1 font-medium text-emerald-400">
                <CheckSquare className="w-3.5 h-3.5" /> HACCP & Betriebshygiene eingehalten
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none text-slate-300">
              <input
                type="checkbox"
                disabled={isReadOnly}
                checked={!!safeActivities[0].arbeitssicherheitNotice}
                onChange={(e) => handleUpdateActivity(0, 'arbeitssicherheitNotice', e.target.checked)}
                className="rounded bg-slate-950 border-slate-700 text-amber-500 focus:ring-amber-500"
              />
              <span className="flex items-center gap-1 font-medium text-blue-400">
                <ShieldAlert className="w-3.5 h-3.5" /> Arbeitssicherheit beachtet
              </span>
            </label>
          </div>
        </div>
      ) : (
        /* Daily entries mode */
        <div className="space-y-4">
          {safeActivities.map((act, idx) => (
            <div
              key={act.id || idx}
              className={`p-4 rounded-xl bg-slate-900/80 border space-y-4 transition ${
                focusedActivityIndex === idx ? 'border-amber-500/50 shadow-md ring-1 ring-amber-500/20' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div className="md:col-span-3">
                  <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">
                    Wochentag / Datum
                  </label>
                  <input
                    type="text"
                    disabled={isReadOnly}
                    value={act.dayOfWeek}
                    onChange={(e) => handleUpdateActivity(idx, 'dayOfWeek', e.target.value)}
                    placeholder="z.B. Dienstag"
                    className="w-full bg-slate-950 text-xs text-slate-200 px-3 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-amber-500/50 disabled:opacity-60 font-medium"
                  />
                </div>

                <div className="md:col-span-6">
                  <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">
                    Bezug Ausbildungsrahmenplan (Optional)
                  </label>
                  <input
                    type="text"
                    disabled={isReadOnly}
                    value={act.bezugAusbildungsrahmenplan || ''}
                    onChange={(e) => handleUpdateActivity(idx, 'bezugAusbildungsrahmenplan', e.target.value)}
                    placeholder="z.B. § 4 Abs. 2 Nr. 3"
                    className="w-full bg-slate-950 text-xs text-slate-200 px-3 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-amber-500/50 disabled:opacity-60"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" /> Stunden
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="16"
                    disabled={isReadOnly}
                    value={act.stunden}
                    onChange={(e) => handleUpdateActivity(idx, 'stunden', Number(e.target.value))}
                    className="w-full bg-slate-950 text-xs text-slate-200 px-3 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-amber-500/50 text-center font-bold disabled:opacity-60"
                  />
                </div>

                {!isReadOnly && safeActivities.length > 1 && (
                  <div className="md:col-span-1 flex justify-end">
                    <button
                      onClick={() => handleRemoveActivity(idx)}
                      className="p-2 rounded-lg text-rose-400 hover:bg-rose-500/10 transition"
                      title="Eintrag entfernen"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase text-slate-400 mb-1">
                  Ausgeführte Tätigkeiten (Freitext)
                </label>
                <textarea
                  rows={2}
                  disabled={isReadOnly}
                  value={act.beschreibung}
                  onFocus={() => setFocusedActivityIndex(idx)}
                  onChange={(e) => handleUpdateActivity(idx, 'beschreibung', e.target.value)}
                  placeholder="Genaue Beschreibung..."
                  className="w-full bg-slate-950 text-xs text-slate-200 px-3 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-amber-500/50 font-mono leading-relaxed"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Schnellwahl & Eigene Textbausteine ganz unten in der Betriebswoche */}
      <div id="schnellwahl-section" className="pt-6 border-t border-slate-800/80 space-y-4 scroll-mt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Schnellwahl & Eigene Textbausteine</span>
          </div>
          <span className="text-[11px] text-slate-400">
            {isSingleWeeklySummary
              ? 'Klick auf eine Schnellwahl fügt den Text direkt im Wochenbericht ein'
              : `Klick fügt den Text im ausgewählten Tag ein (${safeActivities[focusedActivityIndex]?.dayOfWeek || 'Montag'})`}
          </span>
        </div>

        {/* Input form to add a new Schnellwahl */}
        {!isReadOnly && (
          <form onSubmit={handleAddSchnellwahl} className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={schnellwahlInput}
              onChange={(e) => setSchnellwahlInput(e.target.value)}
              placeholder="Eintrag für Schnellwahl hier eingeben (z.B. HACCP-Reinigung & Postenübergabe)..."
              className="flex-1 bg-slate-950 text-xs text-slate-100 px-3.5 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500 transition placeholder:text-slate-500 font-medium"
            />
            <button
              type="submit"
              disabled={!schnellwahlInput.trim()}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:hover:bg-amber-500 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 transition shrink-0 shadow-md shadow-amber-500/10"
            >
              <Plus className="w-4 h-4" />
              <span>Als Schnellwahl speichern</span>
            </button>
          </form>
        )}

        {/* Saved Schnellwahl badges */}
        {customTemplates.length > 0 ? (
          <div className="flex flex-wrap gap-2 pt-1">
            {customTemplates.map((tmpl, tIdx) => (
              <div
                key={tIdx}
                className="group flex items-center gap-1.5 bg-slate-900 border border-slate-700/80 hover:border-amber-500/60 rounded-xl px-3 py-1.5 text-xs text-slate-200 transition shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => applyTemplate(tmpl)}
                  className="hover:text-amber-300 font-medium transition text-left flex items-center gap-1.5"
                  title="In Textfeld einfügen"
                >
                  <span className="text-amber-400 font-bold text-xs">+</span>
                  <span>{tmpl}</span>
                </button>

                {!isReadOnly && onRemoveTemplate && (
                  <button
                    type="button"
                    onClick={() => onRemoveTemplate(tmpl)}
                    className="text-slate-500 hover:text-rose-400 p-0.5 rounded-md hover:bg-slate-800 transition ml-1"
                    title="Schnellwahl löschen"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-slate-900/50 border border-dashed border-slate-800 text-center text-xs text-slate-400">
            Noch keine eigenen Schnellwahlen vorhanden. Tragen Sie im Feld oben einen Text ein und klicken Sie auf <strong className="text-slate-300 font-semibold">„Als Schnellwahl speichern“</strong>.
          </div>
        )}
      </div>
    </div>
  );
};

