import type { InvitationConfig } from './types'
import { bodaDemo } from './boda-demo'
import { xvDemo } from './xv-demo'

export type * from './types'

/**
 * Registro de invitaciones. Para agregar un evento nuevo:
 *   1. Crea `app/events/mi-evento.ts` exportando un `InvitationConfig`.
 *   2. Agrégalo a este arreglo.
 * La ruta `/<slug>`, sus fuentes, su metadato social y su entrada en el panel se generan solos.
 */
export const events: InvitationConfig[] = [bodaDemo, xvDemo]

export function getEvent(slug: string | undefined | null): InvitationConfig | undefined {
  return events.find(e => e.slug === slug)
}
