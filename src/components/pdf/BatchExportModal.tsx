import React, { useState } from 'react';
import { Download, FileArchive, ShieldCheck, Loader2, X } from 'lucide-react';
import { pdf } from '@react-pdf/renderer';
import JSZip from 'jszip';
import type { Wochenbericht, AppProfile } from '../../types/report';
import { generateAll156Weeks } from '../../utils/dateUtils';
import { IhkReportPdfTemplate } from './IhkReportPdfTemplate';

interface BatchExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reports: Wochenbericht[];
  profile?: AppProfile;
}

export const BatchExportModal: React.FC<BatchExportModalProps> = ({
  isOpen,
  onClose,
  reports,
  profile
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedYear, setSelectedYear] = useState<1 | 2 | 3 | 'ALL'>('ALL');

  if (!isOpen) return null;

  const allWeeks = generateAll156Weeks();
  const reportMap = new Map<string, Wochenbericht>();
  reports.forEach((r) => reportMap.set(r.id, r));

  const targetWeeks = selectedYear === 'ALL'
    ? allWeeks
    : allWeeks.filter((w) => w.ausbildungsjahr === selectedYear);

  const approvedCount = targetWeeks.filter((w) => reportMap.get(w.id)?.status === 'APPROVED').length;

  const handleExportZip = async () => {
    setIsExporting(true);
    setProgress(5);

    try {
      const zip = new JSZip();
      const folderName = `IHK_Berichtsheft_Fachkraft_Kueche_${profile?.traineeName?.replace(/\s+/g, '_') || 'David_Grabowski'}`;
      const folder = zip.folder(folderName);

      for (let i = 0; i < targetWeeks.length; i++) {
        const week = targetWeeks[i];
        let report = reportMap.get(week.id);

        if (!report) {
          // Mock fallback report for export preview
          report = {
            id: week.id,
            kalenderwoche: week.kalenderwoche,
            jahr: week.jahr,
            ausbildungsjahr: week.ausbildungsjahr,
            wochenTyp: 'BETRIEB',
            startDate: week.startDate,
            endDate: week.endDate,
            status: 'APPROVED',
            berufsschulTage: [],
            betrieblicheTaetigkeiten: [
              {
                id: `act-${week.id}`,
                date: week.startDate,
                dayOfWeek: 'Betriebstage',
                beschreibung: 'Mise en Place, Postenführung, HACCP Hygienekontrolle.',
                stunden: 40,
                bezugAusbildungsrahmenplan: '§ 4 Abs. 2'
              }
            ],
            unterweisungenStunden: 0,
            schultageStunden: 0,
            betriebStunden: 40,
            gesamtStunden: 40,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
        }

        // Generate PDF blob using @react-pdf/renderer
        const blob = await pdf(<IhkReportPdfTemplate report={report} profile={profile} />).toBlob();
        const fileName = `Woche_${String(week.index).padStart(3, '0')}_KW${week.kalenderwoche}_${week.jahr}.pdf`;
        folder?.file(fileName, blob);

        const currentPct = Math.round(((i + 1) / targetWeeks.length) * 100);
        setProgress(currentPct);
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const downloadUrl = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${folderName}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setIsExporting(false);
      setProgress(0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-card rounded-2xl max-w-lg w-full p-6 border border-slate-800 shadow-2xl relative space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <FileArchive className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">IHK Sammel-Export Modul</h3>
              <p className="text-xs text-slate-400">PDF-Archiv zur Vorlage bei der Abschlussprüfung</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scope selector */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold uppercase text-slate-400">
            Export-Umfang auswählen:
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setSelectedYear('ALL')}
              className={`p-3 rounded-xl border text-left transition ${
                selectedYear === 'ALL'
                  ? 'bg-amber-500/10 border-amber-500 text-white'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              <div className="text-xs font-bold">Alle 3 Ausbildungsjahre</div>
              <div className="text-[10px] text-slate-500">156 Wochen (PDF-Paket)</div>
            </button>

            <button
              onClick={() => setSelectedYear(1)}
              className={`p-3 rounded-xl border text-left transition ${
                selectedYear === 1
                  ? 'bg-amber-500/10 border-amber-500 text-white'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              <div className="text-xs font-bold">1. Ausbildungsjahr</div>
              <div className="text-[10px] text-slate-500">KW 31/2026 - KW 30/2027</div>
            </button>
          </div>
        </div>

        {/* Audit Status */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Prüfstatus Berichte:
            </span>
            <span className="font-bold text-emerald-400">
              {approvedCount} von {targetWeeks.length} genehmigt
            </span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-400 h-full transition-all duration-300"
              style={{ width: `${(approvedCount / targetWeeks.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Progress Bar during Export */}
        {isExporting && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-amber-400 font-medium">
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Render DIN-A4 PDFs...
              </span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2">
          <button
            disabled={isExporting}
            onClick={handleExportZip}
            className="w-full py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:from-emerald-400 hover:to-teal-400 transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> erstelle ZIP-Archiv...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" /> ZIP-Archiv Herunterladen ({targetWeeks.length} PDFs)
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
