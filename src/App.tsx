import { useState, useEffect } from 'react';
import { useReports } from './hooks/useReports';
import type { Wochenbericht, DigitalSignature, WochenTyp } from './types/report';
import { generateAll156Weeks } from './utils/dateUtils';
import { Header } from './components/ui/Header';
import { CalendarOverview } from './components/calendar/CalendarOverview';
import { SchoolDayForm } from './components/forms/SchoolDayForm';
import { CompanyDayForm } from './components/forms/CompanyDayForm';
import { SignatureCanvasModal } from './components/signature/SignatureCanvasModal';
import { RemoteApprovalModal } from './components/signature/RemoteApprovalModal';
import { BatchExportModal } from './components/pdf/BatchExportModal';
import { ProfileModal } from './components/profile/ProfileModal';
import { CloudSyncModal } from './components/ui/CloudSyncModal';
import { IhkReportPdfTemplate } from './components/pdf/IhkReportPdfTemplate';
import { PDFViewer } from '@react-pdf/renderer';
import confetti from 'canvas-confetti';
import {
  ChevronLeft,
  ChevronRight,
  Save,
  Send,
  PenTool,
  CheckCircle2,
  AlertTriangle,
  Download,
  Eye,
  UtensilsCrossed,
  GraduationCap,
  Building2,
  Palmtree,
  Stethoscope
} from 'lucide-react';

export function App() {
  const {
    reports,
    profile,
    syncCode,
    cloudStatus,
    changeSyncCode,
    getOrCreateReport,
    setWeekType,
    saveReport,
    submitReport,
    approveReport,
    rejectReport,
    addCustomTemplate,
    removeCustomTemplate,
    updateProfile,
    ensureDefaultProfile
  } = useReports();

  const allWeeks = generateAll156Weeks();
  const [selectedWeekId, setSelectedWeekId] = useState<string>(allWeeks[0].id);
  const [activeReport, setActiveReport] = useState<Wochenbericht | null>(null);
  const [activeTab, setActiveTab] = useState<'calendar' | 'editor' | 'export'>('calendar');

  // Modals & Feedback
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showCloudSyncModal, setShowCloudSyncModal] = useState(false);
  const [showBatchExportModal, setShowBatchExportModal] = useState(false);
  const [showRemoteModal, setShowRemoteModal] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [sigModalConfig, setSigModalConfig] = useState<{
    isOpen: boolean;
    role: 'TRAINEE' | 'TRAINER';
  }>({ isOpen: false, role: 'TRAINEE' });
  const [showPdfPreview, setShowPdfPreview] = useState(false);

  // Initialize profile & default report
  useEffect(() => {
    ensureDefaultProfile();
  }, []);

  useEffect(() => {
    if (selectedWeekId) {
      getOrCreateReport(selectedWeekId).then((r) => setActiveReport(r));
    }
  }, [selectedWeekId]);

  const currentWeekMeta = allWeeks.find((w) => w.id === selectedWeekId) || allWeeks[0];
  const currentWeekIndex = allWeeks.findIndex((w) => w.id === selectedWeekId);

  const handlePrevWeek = () => {
    if (currentWeekIndex > 0) {
      setSelectedWeekId(allWeeks[currentWeekIndex - 1].id);
    }
  };

  const handleNextWeek = () => {
    if (currentWeekIndex < allWeeks.length - 1) {
      setSelectedWeekId(allWeeks[currentWeekIndex + 1].id);
    }
  };

  const handleSelectWochenTyp = async (type: WochenTyp) => {
    if (!activeReport) return;
    const updated = await setWeekType(activeReport, type);
    setActiveReport(updated);
  };

  const handleSaveDraft = async () => {
    if (!activeReport) return;
    const saved = await saveReport(activeReport);
    setActiveReport(saved);
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 2500);
  };

  const handleSaveSignature = async (sig: DigitalSignature) => {
    if (!activeReport) return;

    if (sig.role === 'TRAINEE') {
      const updated = { ...activeReport, traineeSignature: sig };
      setActiveReport(updated);
      await saveReport(updated);
      await submitReport(activeReport.id, sig);
    } else {
      await approveReport(activeReport.id, sig);
      const freshlyApproved = { ...activeReport, status: 'APPROVED' as const, trainerSignature: sig };
      setActiveReport(freshlyApproved);

      // Trigger Confetti!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const approvedCount = reports.filter((r) => r.status === 'APPROVED').length;
  const isReadOnly = activeReport?.status === 'APPROVED' || activeReport?.status === 'SUBMITTED';

  const isSchoolMode = activeReport?.wochenTyp === 'SCHULE' || activeReport?.wochenTyp === 'SCHULE_BETRIEB';
  const isCompanyMode = activeReport?.wochenTyp === 'BETRIEB' || activeReport?.wochenTyp === 'SCHULE_BETRIEB' || activeReport?.wochenTyp === 'URLAUB' || activeReport?.wochenTyp === 'KRANK';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Bar Header */}
      <Header
        profile={profile}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenProfile={() => setShowProfileModal(true)}
        onOpenBatchExport={() => setShowBatchExportModal(true)}
        onOpenCloudSync={() => setShowCloudSyncModal(true)}
        syncCode={syncCode}
        cloudStatus={cloudStatus}
        approvedCount={approvedCount}
        totalWeeks={allWeeks.length}
      />

      {/* Main Container */}
      <main className="flex-1 pb-16">
        {/* Tab 1: Calendar 156-Week Overview */}
        {activeTab === 'calendar' && (
          <CalendarOverview
            reports={reports}
            selectedWeekId={selectedWeekId}
            onSelectWeek={(wId) => {
              setSelectedWeekId(wId);
              setActiveTab('editor');
            }}
          />
        )}

        {/* Tab 2: Weekly Report Form & Editor */}
        {activeTab === 'editor' && activeReport && (
          <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
            {/* Week Control Bar */}
            <div className="glass-card p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrevWeek}
                  disabled={currentWeekIndex === 0}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 disabled:opacity-30 transition"
                  title="Vorherige Woche"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                      Woche #{currentWeekMeta.index} von 156
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      {currentWeekMeta.ausbildungsjahr}. Ausbildungsjahr
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white tracking-tight mt-0.5">
                    KW {currentWeekMeta.kalenderwoche} / {currentWeekMeta.jahr} ({currentWeekMeta.startDate.split('-').reverse().join('.')} – {currentWeekMeta.endDate.split('-').reverse().join('.')})
                  </h2>
                </div>

                <button
                  onClick={handleNextWeek}
                  disabled={currentWeekIndex === allWeeks.length - 1}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 disabled:opacity-30 transition"
                  title="Nächste Woche"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Status & Actions Bar */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setShowPdfPreview(!showPdfPreview)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-slate-300 hover:text-white border border-slate-800 transition"
                >
                  <Eye className="w-4 h-4 text-amber-400" />
                  <span>{showPdfPreview ? 'Formular' : 'DIN-A4 Vorschau'}</span>
                </button>

                {!isReadOnly && (
                  <button
                    onClick={handleSaveDraft}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/30 transition shadow-sm"
                  >
                    <Save className="w-4 h-4 text-amber-400" />
                    <span>Entwurf Speichern</span>
                  </button>
                )}

                {activeReport.status === 'DRAFT' && (
                  <button
                    onClick={() => setSigModalConfig({ isOpen: true, role: 'TRAINEE' })}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 transition shadow-lg shadow-amber-500/20"
                  >
                    <PenTool className="w-4 h-4" />
                    <span>Signieren & Einreichen</span>
                  </button>
                )}

                {activeReport.status === 'SUBMITTED' && (
                  <button
                    onClick={() => setShowRemoteModal(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-blue-500 text-slate-950 hover:bg-blue-400 transition shadow-lg shadow-blue-500/20"
                  >
                    <Send className="w-4 h-4" />
                    <span>Ausbilder Freigabe / Link</span>
                  </button>
                )}

                {activeReport.status === 'APPROVED' && (
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/30">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>IHK Freigegeben</span>
                  </div>
                )}
              </div>
            </div>

            {/* Week Type Selector Bar */}
            {!isReadOnly && (
              <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-2">
                <label className="block text-xs font-bold uppercase text-slate-400">
                  Modus der Woche auswählen:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  <button
                    onClick={() => handleSelectWochenTyp('BETRIEB')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition ${
                      activeReport.wochenTyp === 'BETRIEB' || !activeReport.wochenTyp
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20'
                        : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <UtensilsCrossed className="w-4 h-4" />
                    <span>Betriebswoche</span>
                  </button>

                  <button
                    onClick={() => handleSelectWochenTyp('SCHULE')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition ${
                      activeReport.wochenTyp === 'SCHULE'
                        ? 'bg-blue-500 text-slate-950 border-blue-400 shadow-lg shadow-blue-500/20'
                        : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>Berufsschule (Rein)</span>
                  </button>

                  <button
                    onClick={() => handleSelectWochenTyp('SCHULE_BETRIEB')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition ${
                      activeReport.wochenTyp === 'SCHULE_BETRIEB'
                        ? 'bg-indigo-500 text-white border-indigo-400 shadow-lg shadow-indigo-500/20'
                        : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-indigo-300" />
                    <span>Schule + Betrieb</span>
                  </button>

                  <button
                    onClick={() => handleSelectWochenTyp('URLAUB')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition ${
                      activeReport.wochenTyp === 'URLAUB'
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/20'
                        : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <Palmtree className="w-4 h-4" />
                    <span>Urlaubswoche</span>
                  </button>

                  <button
                    onClick={() => handleSelectWochenTyp('KRANK')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition ${
                      activeReport.wochenTyp === 'KRANK'
                        ? 'bg-rose-500 text-slate-950 border-rose-400 shadow-lg shadow-rose-500/20'
                        : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <Stethoscope className="w-4 h-4" />
                    <span>Krankheit</span>
                  </button>
                </div>
              </div>
            )}

            {/* Rejection Warning Banner */}
            {activeReport.status === 'REJECTED' && (
              <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-rose-300">Korrektur vom Ausbilder angefordert</h4>
                  <p className="text-xs text-rose-200 mt-0.5">
                    "{activeReport.rejectionReason || 'Bitte Angaben zur Küchenpraxis überarbeiten.'}"
                  </p>
                </div>
              </div>
            )}

            {/* Content: Form vs PDF Live Preview */}
            {!showPdfPreview ? (
              <div className="space-y-6">
                {/* Render School Form if SCHULE or SCHULE_BETRIEB */}
                {isSchoolMode && (
                  <SchoolDayForm
                    schoolDays={activeReport.berufsschulTage}
                    onChangeSchoolDays={(days) => {
                      const updated = { ...activeReport, berufsschulTage: days };
                      setActiveReport(updated);
                      saveReport(updated);
                    }}
                    isCombinedMode={activeReport.wochenTyp === 'SCHULE_BETRIEB'}
                    onToggleCombinedMode={(combined) => {
                      handleSelectWochenTyp(combined ? 'SCHULE_BETRIEB' : 'SCHULE');
                    }}
                    isReadOnly={isReadOnly}
                  />
                )}

                {/* Render Company Form if BETRIEB, SCHULE_BETRIEB, URLAUB, KRANK */}
                {isCompanyMode && (
                  <CompanyDayForm
                    activities={activeReport.betrieblicheTaetigkeiten}
                    onChange={(acts) => {
                      const updated = { ...activeReport, betrieblicheTaetigkeiten: acts };
                      setActiveReport(updated);
                      saveReport(updated);
                    }}
                    customTemplates={profile?.customTaskTemplates || []}
                    onAddTemplate={addCustomTemplate}
                    onRemoveTemplate={removeCustomTemplate}
                    isReadOnly={isReadOnly}
                  />
                )}
              </div>
            ) : (
              <div className="glass-card rounded-2xl p-4 border border-slate-800 h-[650px] overflow-hidden">
                <PDFViewer width="100%" height="100%" className="rounded-xl border border-slate-700">
                  <IhkReportPdfTemplate report={activeReport} profile={profile} />
                </PDFViewer>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: PDF Export Hub */}
        {activeTab === 'export' && (
          <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
            <div className="glass-card p-6 rounded-2xl border border-slate-800 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto">
                <Download className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-white">IHK PDF Export & Gesamtarchiv</h2>
              <p className="text-slate-400 text-sm max-w-lg mx-auto">
                Erzeugen Sie valide DIN-A4 PDF-Dateien nach IHK-Standard inklusive Vektor-Unterschriften und KMK-Lernfeldzuordnungen für die Abschlussprüfung.
              </p>
              <div className="pt-2 flex justify-center gap-4">
                <button
                  onClick={() => setShowBatchExportModal(true)}
                  className="px-6 py-3 rounded-xl font-bold text-xs bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" /> Alle 156 PDFs als ZIP herunterladen
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating Save Toast Notification */}
      {showSavedToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-emerald-500 text-slate-950 font-bold px-4 py-2.5 rounded-xl shadow-2xl animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-slate-950" />
          <span>Entwurf erfolgreich gespeichert!</span>
        </div>
      )}

      {/* Modals */}
      <SignatureCanvasModal
        isOpen={sigModalConfig.isOpen}
        onClose={() => setSigModalConfig({ ...sigModalConfig, isOpen: false })}
        onSaveSignature={handleSaveSignature}
        role={sigModalConfig.role}
        defaultName={
          sigModalConfig.role === 'TRAINEE'
            ? profile?.traineeName || 'David Grabowski'
            : profile?.trainerName || 'Birgit Witt'
        }
      />

      {activeReport && (
        <RemoteApprovalModal
          isOpen={showRemoteModal}
          onClose={() => setShowRemoteModal(false)}
          report={activeReport}
          onSendRemoteLink={() => {
            alert('Prüflink erfolgreich per E-Mail an den Ausbilder versendet!');
            setShowRemoteModal(false);
          }}
          onRejectReport={(reason) => rejectReport(activeReport.id, reason)}
          onOpenTrainerSignature={() => {
            setSigModalConfig({ isOpen: true, role: 'TRAINER' });
          }}
        />
      )}

      <BatchExportModal
        isOpen={showBatchExportModal}
        onClose={() => setShowBatchExportModal(false)}
        reports={reports}
        profile={profile}
      />

      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        profile={profile}
        onSaveProfile={updateProfile}
      />

      <CloudSyncModal
        isOpen={showCloudSyncModal}
        onClose={() => setShowCloudSyncModal(false)}
        syncCode={syncCode}
        cloudStatus={cloudStatus}
        onChangeSyncCode={changeSyncCode}
      />
    </div>
  );
}
