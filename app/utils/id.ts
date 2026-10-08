/** Identificador único (UUID cuando el navegador lo soporta). Separado de `rsvp.ts` para no arrastrar zod al bundle inicial. */
export function createId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}
