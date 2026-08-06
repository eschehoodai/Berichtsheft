import Dexie, { type Table } from 'dexie';
import type { Wochenbericht, AppProfile } from '../types/report';

export class BerichtsheftDB extends Dexie {
  reports!: Table<Wochenbericht, string>;
  profile!: Table<AppProfile, number>;

  constructor() {
    super('IHKBerichtsheftFachkraftKueche');
    this.version(1).stores({
      reports: 'id, kalenderwoche, jahr, ausbildungsjahr, status, startDate, endDate, remoteApprovalToken, updatedAt',
      profile: '++id'
    });
  }
}

export const db = new BerichtsheftDB();

export async function getOrCreateDefaultProfile(): Promise<AppProfile> {
  const existing = await db.profile.toCollection().first();
  if (existing) {
    let needsUpdate = false;
    const updated = { ...existing };
    if (existing.traineeName === 'Max Mustermann') {
      updated.traineeName = 'David Grabowski';
      needsUpdate = true;
    }
    if (!existing.companyName || existing.companyName === 'Gourmet Restaurant & Hotel Sonnenhof') {
      updated.companyName = 'Romantikhotel zum Lindengarten';
      needsUpdate = true;
    }
    if (!existing.trainerName || existing.trainerName === 'Küchenmeister Hans Müller') {
      updated.trainerName = 'Birgit Witt';
      needsUpdate = true;
    }
    if (needsUpdate) {
      await db.profile.put(updated);
      return updated;
    }
    return existing;
  }

  const defaultProfile: AppProfile = {
    traineeName: 'David Grabowski',
    birthDate: '2007-04-15',
    companyName: 'Romantikhotel zum Lindengarten',
    trainerName: 'Birgit Witt',
    ihkName: 'IHK Dresden / Gewerberegion Gastronomie',
    ausbildungsStart: '2026-08-01',
    ausbildungsEnde: '2029-07-31'
  };

  const id = await db.profile.add(defaultProfile);
  return { ...defaultProfile, id };
}
