import type { InvitationConfig, Lugar } from '~/events/types'
import type { CalendarEvent } from '~/utils/ics'
import { buildICS, googleCalendarUrl, outlookCalendarUrl } from '~/utils/ics'
import { downloadFile, slugify } from '~/utils/browser'

/** Datos de calendario para la ceremonia o la recepción. */
export function useCalendar(config: InvitationConfig) {
  function toEvent(lugar: Lugar): CalendarEvent {
    const kind = eventKind(config)
    const url = typeof window !== 'undefined' ? `${window.location.origin}/${config.slug}` : undefined
    return {
      uid: `${config.slug}-${slugify(lugar.titulo)}-${lugar.inicio.slice(0, 10)}@invitacion-digital`,
      title: `${kind} ${config.titulo} · ${lugar.titulo}`,
      description: `${lugar.titulo} — ${lugar.nombre}\n${lugar.direccion}`,
      location: `${lugar.nombre}, ${lugar.direccion}`,
      start: lugar.inicio,
      durationMin: lugar.duracionMin,
      url,
    }
  }

  return {
    google: (lugar: Lugar) => googleCalendarUrl(toEvent(lugar)),
    outlook: (lugar: Lugar) => outlookCalendarUrl(toEvent(lugar)),
    download(lugar: Lugar) {
      const ev = toEvent(lugar)
      downloadFile(`${slugify(`${config.titulo} ${lugar.titulo}`)}.ics`, buildICS(ev), 'text/calendar;charset=utf-8')
    },
  }
}
