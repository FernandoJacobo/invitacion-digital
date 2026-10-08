import { format } from 'date-fns'
import { es } from 'date-fns/locale'

/**
 * Convierte un ISO con desfase (`2027-04-17T17:00:00-06:00`) en un `Date` con esa misma hora "de pared"
 * en la zona del navegador. Así un invitado en Madrid ve "5:00 p. m." (hora del evento), no la conversión.
 */
export function wallClock(iso: string): Date {
  const m = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2})(?::(\d{2}))?)?/.exec(iso)
  if (!m) return new Date(iso)
  const [, y, mo, d, h = '0', mi = '0', s = '0'] = m
  return new Date(Number(y), Number(mo) - 1, Number(d), Number(h), Number(mi), Number(s))
}

/** "sábado 17 de abril de 2027" */
export function formatLongDate(iso: string): string {
  return format(wallClock(iso), "EEEE d 'de' MMMM 'de' yyyy", { locale: es })
}

/** "17 · 04 · 2027" */
export function formatDots(iso: string): string {
  return format(wallClock(iso), 'dd · MM · yyyy')
}

/** "abril" */
export function formatMonth(iso: string): string {
  return format(wallClock(iso), 'MMMM', { locale: es })
}

/** "sábado" */
export function formatWeekday(iso: string): string {
  return format(wallClock(iso), 'EEEE', { locale: es })
}

/** "5:00 p. m." */
export function formatTime(iso: string): string {
  return format(wallClock(iso), 'h:mm aaaa', { locale: es })
}

/** "17:00" → "5:00 p. m." */
export function formatHHMM(hhmm: string): string {
  const [h = 0, m = 0] = hhmm.split(':').map(Number)
  return format(new Date(2000, 0, 1, h, m), 'h:mm aaaa', { locale: es })
}

/** "20 de marzo de 2027" */
export function formatDeadline(ymd: string): string {
  return format(wallClock(ymd), "d 'de' MMMM 'de' yyyy", { locale: es })
}

/** "8 oct 2026 · 10:32" (para el panel) */
export function formatTimestamp(ms: number): string {
  return format(new Date(ms), "d MMM yyyy '·' HH:mm", { locale: es })
}

/** Primera letra en mayúscula. */
export function capitalize(text: string): string {
  return text.charAt(0).toLocaleUpperCase('es-MX') + text.slice(1)
}
