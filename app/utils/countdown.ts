export interface Countdown {
  days: number
  hours: number
  minutes: number
  seconds: number
  /** Milisegundos restantes (0 si ya pasó). */
  totalMs: number
  done: boolean
}

/** Tiempo restante entre `now` y `target`, desglosado. Nunca devuelve valores negativos. */
export function getCountdown(target: Date | string, now: Date | number = Date.now()): Countdown {
  const t = typeof target === 'string' ? new Date(target).getTime() : target.getTime()
  const n = typeof now === 'number' ? now : now.getTime()
  const totalMs = Math.max(0, t - n)
  const totalSec = Math.floor(totalMs / 1000)
  return {
    days: Math.floor(totalSec / 86400),
    hours: Math.floor((totalSec % 86400) / 3600),
    minutes: Math.floor((totalSec % 3600) / 60),
    seconds: totalSec % 60,
    totalMs,
    done: totalMs === 0,
  }
}

export function pad2(n: number): string {
  return String(n).padStart(2, '0')
}
