/**
 * Date helpers for pickers that must not allow days that have already ended
 * (schedules, contract end dates, premium end dates). Uses the admin's local time.
 */

/** Today as "YYYY-MM-DD" in local time (toISOString() would give the UTC date). */
export function todayLocal(): string {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Current local time as "HH:MM" — the earliest time allowed when the chosen date is today. */
export function nowLocalTime(): string {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** True if the local date ("YYYY-MM-DD") is before today. */
export function isPastDay(date: string): boolean {
    return !!date && date.slice(0, 10) < todayLocal();
}

/** True if local date + optional "HH:MM" time is now or earlier. */
export function isPastDateTime(date: string, time?: string): boolean {
    if (!date) return false;
    return new Date(`${date.slice(0, 10)}T${time || "00:00"}:00`) <= new Date();
}
