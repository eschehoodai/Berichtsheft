export interface CalendarWeekInfo {
  index: number; // 1 to 156
  id: string; // e.g. "2026-W31"
  kalenderwoche: number;
  jahr: number;
  ausbildungsjahr: 1 | 2 | 3;
  startDate: string; // YYYY-MM-DD (Monday)
  endDate: string; // YYYY-MM-DD (Sunday)
  label: string; // e.g. "KW 31 / 2026 (03.08. - 09.08.2026)"
}

/**
 * Calculates ISO Week Number and Year for a given Date
 */
export function getISOWeekDetails(d: Date): { week: number; year: number } {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return { week: weekNo, year: date.getUTCFullYear() };
}

/**
 * Gets the Monday of the week for a given date
 */
export function getMonday(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  date.setDate(diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

/**
 * Formats a Date object to YYYY-MM-DD
 */
export function formatDateISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Formats YYYY-MM-DD to DD.MM.YYYY
 */
export function formatDateGerman(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  return `${parts[2]}.${parts[1]}.${parts[0]}`;
}

/**
 * Formats YYYY-MM-DD to DD.MM.
 */
export function formatDateShort(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  return `${parts[2]}.${parts[1]}.`;
}

/**
 * Generates all 156 apprenticeship weeks starting from August 1st, 2026 to July 31st, 2029
 */
export function generateAll156Weeks(): CalendarWeekInfo[] {
  const weeks: CalendarWeekInfo[] = [];

  const startDate = new Date(2026, 6, 27); // 2026-07-27 (Monday of KW31 2026)

  for (let i = 0; i < 156; i++) {
    const currentMonday = new Date(startDate);
    currentMonday.setDate(startDate.getDate() + i * 7);

    const currentSunday = new Date(currentMonday);
    currentSunday.setDate(currentMonday.getDate() + 6);

    const isoDetails = getISOWeekDetails(currentMonday);

    // Determine apprenticeship year (1, 2, or 3)
    let ausbildungsjahr: 1 | 2 | 3 = 1;
    if (i >= 52 && i < 104) {
      ausbildungsjahr = 2;
    } else if (i >= 104) {
      ausbildungsjahr = 3;
    }

    const mondayISO = formatDateISO(currentMonday);
    const sundayISO = formatDateISO(currentSunday);

    weeks.push({
      index: i + 1,
      id: `${isoDetails.year}-W${String(isoDetails.week).padStart(2, '0')}-${i + 1}`,
      kalenderwoche: isoDetails.week,
      jahr: isoDetails.year,
      ausbildungsjahr,
      startDate: mondayISO,
      endDate: sundayISO,
      label: `KW ${isoDetails.week} / ${isoDetails.year} (${formatDateShort(mondayISO)} - ${formatDateGerman(sundayISO)})`
    });
  }

  return weeks;
}

/**
 * Returns array of 7 days (Montag - Sonntag) for a full company week
 */
export function getSevenDaysForWeek(mondayISO: string): Array<{ date: string; dayName: string }> {
  const result = [];
  const dayNames = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];
  const [y, m, d] = mondayISO.split('-').map(Number);
  const monday = new Date(y, m - 1, d);

  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(monday);
    dayDate.setDate(monday.getDate() + i);
    result.push({
      date: formatDateISO(dayDate),
      dayName: dayNames[i]
    });
  }

  return result;
}

/**
 * Returns array of 5 school days (Montag - Freitag)
 */
export function getSchoolDaysForWeek(mondayISO: string): Array<{ date: string; dayName: string }> {
  const result = [];
  const dayNames = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag'];
  const [y, m, d] = mondayISO.split('-').map(Number);
  const monday = new Date(y, m - 1, d);

  for (let i = 0; i < 5; i++) {
    const dayDate = new Date(monday);
    dayDate.setDate(monday.getDate() + i);
    result.push({
      date: formatDateISO(dayDate),
      dayName: dayNames[i]
    });
  }

  return result;
}
