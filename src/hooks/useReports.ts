import { useLiveQuery } from 'dexie-react-hooks';
import { db, getOrCreateDefaultProfile } from '../db/database';
import type { Wochenbericht, DigitalSignature, AppProfile, WochenTyp, BetrieblicheTaetigkeit } from '../types/report';
import { generateAll156Weeks, getSchoolDaysForWeek } from '../utils/dateUtils';

export function useReports() {
  const reports = useLiveQuery(() => db.reports.toArray(), [], []);
  const profile = useLiveQuery(() => db.profile.toCollection().first(), [], undefined);

  /**
   * Get or create report object for a given week ID
   */
  const getOrCreateReport = async (weekId: string): Promise<Wochenbericht> => {
    const existing = await db.reports.get(weekId);
    if (existing) return existing;

    const allWeeks = generateAll156Weeks();
    const weekMeta = allWeeks.find((w) => w.id === weekId) || allWeeks[0];

    const now = new Date().toISOString();
    const defaultWeeklyActivity: BetrieblicheTaetigkeit = {
      id: `weekly-${weekMeta.id}`,
      date: weekMeta.startDate,
      dayOfWeek: 'Montag – Sonntag (Gesamte Woche)',
      beschreibung: '',
      stunden: 40,
      bezugAusbildungsrahmenplan: '§ 4 Abs. 2',
      haccpHygieneNotice: true,
      arbeitssicherheitNotice: true
    };

    const newReport: Wochenbericht = {
      id: weekMeta.id,
      kalenderwoche: weekMeta.kalenderwoche,
      jahr: weekMeta.jahr,
      ausbildungsjahr: weekMeta.ausbildungsjahr,
      wochenTyp: 'BETRIEB',
      startDate: weekMeta.startDate,
      endDate: weekMeta.endDate,
      status: 'DRAFT',
      berufsschulTage: [],
      betrieblicheTaetigkeiten: [defaultWeeklyActivity],
      hasWeekendWork: false,
      unterweisungenStunden: 0,
      schultageStunden: 0,
      betriebStunden: 40,
      gesamtStunden: 40,
      createdAt: now,
      updatedAt: now
    };

    await db.reports.put(newReport);
    return newReport;
  };

  /**
   * Switch week type (BETRIEB, SCHULE, SCHULE_BETRIEB, URLAUB, KRANK) while preserving user entered text
   */
  const setWeekType = async (report: Wochenbericht, newType: WochenTyp): Promise<Wochenbericht> => {
    const schoolDays = getSchoolDaysForWeek(report.startDate);

    let updatedSchoolDays = [...(report.berufsschulTage || [])];
    let updatedCompanyActs = [...(report.betrieblicheTaetigkeiten || [])];

    if (newType === 'SCHULE' || newType === 'SCHULE_BETRIEB') {
      // Ensure 5 school days (Mon-Fri) exist
      if (updatedSchoolDays.length === 0) {
        updatedSchoolDays = schoolDays.map((d) => ({
          date: d.date,
          dayOfWeek: d.dayName,
          fach: 'Unterricht',
          thema: '',
          stunden: 8
        }));
      }

      if (newType === 'SCHULE_BETRIEB') {
        // Initialize company activities if empty
        if (updatedCompanyActs.length === 0) {
          updatedCompanyActs = [
            {
              id: `company-${report.id}`,
              date: report.startDate,
              dayOfWeek: 'Betriebstage / Wochenende',
              beschreibung: '',
              stunden: 8,
              bezugAusbildungsrahmenplan: '§ 4 Abs. 2',
              haccpHygieneNotice: true,
              arbeitssicherheitNotice: true
            }
          ];
        }
      }
    } else if (newType === 'BETRIEB') {
      // Ensure at least 1 company activity exists
      if (updatedCompanyActs.length === 0) {
        updatedCompanyActs = [
          {
            id: `weekly-${report.id}`,
            date: report.startDate,
            dayOfWeek: 'Montag – Sonntag (Gesamte Woche)',
            beschreibung: '',
            stunden: 40,
            bezugAusbildungsrahmenplan: '§ 4 Abs. 2',
            haccpHygieneNotice: true,
            arbeitssicherheitNotice: true
          }
        ];
      }
    } else if (newType === 'URLAUB') {
      if (updatedCompanyActs.length === 0 || !updatedCompanyActs[0].beschreibung.includes('Urlaub')) {
        updatedCompanyActs = [
          {
            id: `vacation-${report.id}`,
            date: report.startDate,
            dayOfWeek: 'Montag – Sonntag',
            beschreibung: 'Urlaub / Tarifeurlaub',
            stunden: 40
          }
        ];
      }
    } else if (newType === 'KRANK') {
      if (updatedCompanyActs.length === 0 || !updatedCompanyActs[0].beschreibung.includes('krank')) {
        updatedCompanyActs = [
          {
            id: `sick-${report.id}`,
            date: report.startDate,
            dayOfWeek: 'Montag – Sonntag',
            beschreibung: 'Arbeitsunfähig krank (mit AU)',
            stunden: 40
          }
        ];
      }
    }

    const isSchoolMode = newType === 'SCHULE' || newType === 'SCHULE_BETRIEB';
    const isCompanyMode = newType === 'BETRIEB' || newType === 'SCHULE_BETRIEB' || newType === 'URLAUB' || newType === 'KRANK';

    const totalSchool = isSchoolMode ? updatedSchoolDays.reduce((sum, d) => sum + (d.stunden || 0), 0) : 0;
    const totalCompany = isCompanyMode ? updatedCompanyActs.reduce((sum, a) => sum + (a.stunden || 0), 0) : 0;

    const updated: Wochenbericht = {
      ...report,
      wochenTyp: newType,
      berufsschulTage: updatedSchoolDays,
      betrieblicheTaetigkeiten: updatedCompanyActs,
      schultageStunden: totalSchool,
      betriebStunden: totalCompany,
      gesamtStunden: totalSchool + totalCompany,
      updatedAt: new Date().toISOString()
    };

    await db.reports.put(updated);
    return updated;
  };

  /**
   * Save changes to a report and return calculated object
   */
  const saveReport = async (updated: Wochenbericht): Promise<Wochenbericht> => {
    const isSchoolMode = updated.wochenTyp === 'SCHULE' || updated.wochenTyp === 'SCHULE_BETRIEB';
    const isCompanyMode = updated.wochenTyp === 'BETRIEB' || updated.wochenTyp === 'SCHULE_BETRIEB' || updated.wochenTyp === 'URLAUB' || updated.wochenTyp === 'KRANK';

    const totalSchool = isSchoolMode ? updated.berufsschulTage.reduce((sum, d) => sum + (d.stunden || 0), 0) : 0;
    const totalCompany = isCompanyMode ? updated.betrieblicheTaetigkeiten.reduce((sum, a) => sum + (a.stunden || 0), 0) : 0;

    const calculated: Wochenbericht = {
      ...updated,
      schultageStunden: totalSchool,
      betriebStunden: totalCompany,
      gesamtStunden: totalSchool + totalCompany,
      updatedAt: new Date().toISOString()
    };

    await db.reports.put(calculated);
    return calculated;
  };

  /**
   * Submit report for approval
   */
  const submitReport = async (reportId: string, traineeSig?: DigitalSignature) => {
    const report = await db.reports.get(reportId);
    if (!report) return;

    const token = Math.random().toString(36).substring(2) + Date.now().toString(36);

    const updated: Wochenbericht = {
      ...report,
      status: 'SUBMITTED',
      traineeSignature: traineeSig || report.traineeSignature,
      remoteApprovalToken: token,
      updatedAt: new Date().toISOString()
    };

    await db.reports.put(updated);
  };

  /**
   * Approve report (Trainer signature)
   */
  const approveReport = async (reportId: string, trainerSig: DigitalSignature) => {
    const report = await db.reports.get(reportId);
    if (!report) return;

    const updated: Wochenbericht = {
      ...report,
      status: 'APPROVED',
      trainerSignature: trainerSig,
      rejectionReason: undefined,
      updatedAt: new Date().toISOString()
    };

    await db.reports.put(updated);
  };

  /**
   * Reject report with feedback
   */
  const rejectReport = async (reportId: string, reason: string) => {
    const report = await db.reports.get(reportId);
    if (!report) return;

    const updated: Wochenbericht = {
      ...report,
      status: 'REJECTED',
      rejectionReason: reason,
      updatedAt: new Date().toISOString()
    };

    await db.reports.put(updated);
  };

  /**
   * Save a new custom task template to profile
   */
  const addCustomTemplate = async (templateText: string) => {
    const p = profile || (await getOrCreateDefaultProfile());
    const existing = p.customTaskTemplates || [];
    if (existing.includes(templateText)) return;

    const updated: AppProfile = {
      ...p,
      customTaskTemplates: [...existing, templateText]
    };

    await db.profile.clear();
    await db.profile.add(updated);
  };

  /**
   * Remove a custom task template
   */
  const removeCustomTemplate = async (templateText: string) => {
    const p = profile;
    if (!p || !p.customTaskTemplates) return;

    const updated: AppProfile = {
      ...p,
      customTaskTemplates: p.customTaskTemplates.filter((t) => t !== templateText)
    };

    await db.profile.clear();
    await db.profile.add(updated);
  };

  /**
   * Update profile
   */
  const updateProfile = async (updated: AppProfile) => {
    await db.profile.clear();
    await db.profile.add(updated);
  };

  return {
    reports: reports || [],
    profile,
    getOrCreateReport,
    setWeekType,
    saveReport,
    submitReport,
    approveReport,
    rejectReport,
    addCustomTemplate,
    removeCustomTemplate,
    updateProfile,
    ensureDefaultProfile: getOrCreateDefaultProfile
  };
}
