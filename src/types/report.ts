export type ReportStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';

export type DayType = 'COMPANY' | 'SCHOOL' | 'VACATION' | 'SICK_LEAVE' | 'HOLIDAY';

export type WochenTyp = 'BETRIEB' | 'SCHULE' | 'SCHULE_BETRIEB' | 'URLAUB' | 'KRANK';

export interface BerufsschulTag {
  date: string; // ISO format: YYYY-MM-DD
  dayOfWeek: string; // 'Montag', 'Dienstag', etc.
  fach?: string; // e.g. "Fachtheorie Küchentechnik", "Wirtschaftslehre", "Deutsch"
  thema: string; // Free text description entered by user
  stunden: number;
  notizen?: string;
  lernfeldId?: number; // Optional reference
}

export interface BetrieblicheTaetigkeit {
  id: string;
  date: string; // ISO format: YYYY-MM-DD
  dayOfWeek: string;
  beschreibung: string; // Free text description entered by user
  stunden: number;
  bezugAusbildungsrahmenplan?: string;
  haccpHygieneNotice?: boolean;
  arbeitssicherheitNotice?: boolean;
  isWeekendWork?: boolean; // Toggle if worked on weekend during school week
}

export interface DigitalSignature {
  signedBy: string;
  role: 'TRAINEE' | 'TRAINER';
  signatureDataUrl: string;
  timestamp: string; // ISO String
  verificationHash?: string;
}

export interface Wochenbericht {
  id: string; // e.g. "2026-W31-1"
  kalenderwoche: number; // 1 - 53
  jahr: number; // 2026, 2027, 2028, 2029
  ausbildungsjahr: 1 | 2 | 3;
  wochenTyp: WochenTyp; // 'BETRIEB' | 'SCHULE' | 'SCHULE_BETRIEB' | 'URLAUB' | 'KRANK'
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  status: ReportStatus;
  berufsschulTage: BerufsschulTag[];
  betrieblicheTaetigkeiten: BetrieblicheTaetigkeit[];
  hasWeekendWork?: boolean;
  unterweisungenStunden: number;
  schultageStunden: number;
  betriebStunden: number;
  gesamtStunden: number;
  traineeSignature?: DigitalSignature;
  trainerSignature?: DigitalSignature;
  archivedPdfUrl?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  remoteApprovalToken?: string;
}

export interface AppProfile {
  id?: number;
  traineeName: string;
  birthDate?: string;
  companyName: string;
  trainerName: string;
  ihkName: string;
  ausbildungsStart: string; // "2026-08-01"
  ausbildungsEnde: string; // "2029-07-31"
  customTaskTemplates?: string[]; // User saved task templates for repeating activities
}
