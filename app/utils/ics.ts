export interface CalendarEvent {
  uid: string
  title: string
  description: string
  location: string
  /** ISO 8601 con desfase: `2027-04-17T17:00:00-06:00`. */
  start: string
  durationMin: number
  url?: string
}

/** Marca de tiempo UTC en formato iCalendar: `20270417T230000Z`. */
export function toICSUtc(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

export function eventRange(event: Pick<CalendarEvent, 'start' | 'durationMin'>): { start: Date, end: Date } {
  const start = new Date(event.start)
  return { start, end: new Date(start.getTime() + event.durationMin * 60_000) }
}

/** Escapa texto según RFC 5545 §3.3.11. */
export function escapeICSText(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n')
}

/** Pliega líneas a 75 octetos (RFC 5545 §3.1) sin partir caracteres multibyte. */
export function foldICSLine(line: string): string {
  const encoder = new TextEncoder()
  if (encoder.encode(line).length <= 75) return line
  const parts: string[] = []
  let current = ''
  let bytes = 0
  for (const char of line) {
    const size = encoder.encode(char).length
    const limit = parts.length === 0 ? 75 : 74 // las continuaciones empiezan con un espacio
    if (bytes + size > limit) {
      parts.push(current)
      current = ''
      bytes = 0
    }
    current += char
    bytes += size
  }
  parts.push(current)
  return parts.join('\r\n ')
}

/**
 * Genera un `.ics` válido para Google Calendar, Apple Calendar y Outlook.
 * Las horas van en UTC (sufijo `Z`), lo que evita depender de definiciones VTIMEZONE.
 */
export function buildICS(event: CalendarEvent, now: Date = new Date()): string {
  const { start, end } = eventRange(event)
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//JacoboDev//Invitacion Digital//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${event.uid}`,
    `DTSTAMP:${toICSUtc(now)}`,
    `DTSTART:${toICSUtc(start)}`,
    `DTEND:${toICSUtc(end)}`,
    `SUMMARY:${escapeICSText(event.title)}`,
    `DESCRIPTION:${escapeICSText(event.description)}`,
    `LOCATION:${escapeICSText(event.location)}`,
    ...(event.url ? [`URL:${event.url}`] : []),
    'STATUS:CONFIRMED',
    'TRANSP:OPAQUE',
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    `DESCRIPTION:${escapeICSText(event.title)}`,
    'TRIGGER:-P1D',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ]
  return `${lines.map(foldICSLine).join('\r\n')}\r\n`
}

/** Enlace "Agregar a Google Calendar" prellenado. */
export function googleCalendarUrl(event: CalendarEvent): string {
  const { start, end } = eventRange(event)
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${toICSUtc(start)}/${toICSUtc(end)}`,
    details: event.url ? `${event.description}\n\n${event.url}` : event.description,
    location: event.location,
    ctz: 'America/Mexico_City',
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

/** Enlace "Agregar a Outlook.com" prellenado. */
export function outlookCalendarUrl(event: CalendarEvent): string {
  const { start, end } = eventRange(event)
  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: event.title,
    startdt: start.toISOString(),
    enddt: end.toISOString(),
    body: event.description,
    location: event.location,
  })
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`
}
