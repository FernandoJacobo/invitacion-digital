import type { Ref } from 'vue'
import { normalizeName } from '~/utils/guest'

export type RowStatus = 'si' | 'no' | 'pendiente'

export interface AdminRow {
  key: string
  evento: string
  nombre: string
  estado: RowStatus
  /** Personas confirmadas (0 si no asiste o pendiente). */
  pases: number
  pasesAsignados: number
  restricciones: string
  mensaje: string
  /** Última respuesta (ms) o `null` si está pendiente. */
  fecha: number | null
  responseId?: string
  guestId?: string
}

/**
 * Une la lista de invitados (generador de enlaces) con las confirmaciones recibidas.
 * Un invitado sin respuesta queda "pendiente"; una respuesta sin invitado en la lista también cuenta.
 */
export function useAdminRows(evento: Ref<string>) {
  const rsvp = useRsvpStore()
  const guests = useGuestsStore()

  const rows = computed<AdminRow[]>(() => {
    const out: AdminRow[] = []
    const matched = new Set<string>()
    const responses = rsvp.responses.filter(r => evento.value === 'todos' || r.evento === evento.value)
    const byName = new Map(responses.map(r => [`${r.evento}|${normalizeName(r.invitado ?? r.nombre)}`, r]))

    for (const g of guests.guests) {
      if (evento.value !== 'todos' && g.evento !== evento.value) continue
      const r = byName.get(`${g.evento}|${normalizeName(g.nombre)}`)
      if (r) matched.add(r.id)
      out.push({
        key: `g-${g.id}`,
        evento: g.evento,
        nombre: r?.nombre ?? g.nombre,
        estado: r?.asistencia ?? 'pendiente',
        pases: r?.pases ?? 0,
        pasesAsignados: g.pases,
        restricciones: r?.restricciones ?? '',
        mensaje: r?.mensaje ?? '',
        fecha: r?.actualizado ?? null,
        responseId: r?.id,
        guestId: g.id,
      })
    }
    for (const r of responses) {
      if (matched.has(r.id)) continue
      out.push({
        key: `r-${r.id}`,
        evento: r.evento,
        nombre: r.nombre,
        estado: r.asistencia,
        pases: r.pases,
        pasesAsignados: r.pasesAsignados,
        restricciones: r.restricciones,
        mensaje: r.mensaje,
        fecha: r.actualizado,
        responseId: r.id,
      })
    }
    // Respuestas recientes primero; pendientes al final.
    return out.sort((a, b) => (b.fecha ?? 0) - (a.fecha ?? 0))
  })

  const kpis = computed(() => {
    const list = rows.value
    const si = list.filter(r => r.estado === 'si')
    return {
      invitados: list.length,
      confirmados: si.length,
      noAsisten: list.filter(r => r.estado === 'no').length,
      pendientes: list.filter(r => r.estado === 'pendiente').length,
      personas: si.reduce((sum, r) => sum + r.pases, 0),
      pasesAsignados: list.reduce((sum, r) => sum + r.pasesAsignados, 0),
    }
  })

  return { rows, kpis }
}
