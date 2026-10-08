/** Parámetros de una invitación personalizada (`?invitado=Familia%20Perez&pases=4`). */
export interface GuestParams {
  /** Nombre del invitado o `null` si la invitación es genérica. */
  invitado: string | null
  /** Pases asignados (límite del RSVP). */
  pases: number
  /** `true` si la URL traía al menos un parámetro válido. */
  personalizada: boolean
}

export interface GuestLimits {
  pasesPorDefecto: number
  maxPases: number
}

type QueryValue = string | null | undefined | (string | null)[]

const MAX_NAME_LENGTH = 60

function first(value: QueryValue): string | undefined {
  if (Array.isArray(value)) return value.find(v => typeof v === 'string') ?? undefined
  return value ?? undefined
}

/** Limpia un nombre recibido por URL: sin etiquetas, sin caracteres de control y con longitud acotada. */
export function sanitizeGuestName(raw: string | undefined | null): string | null {
  if (!raw) return null
  const clean = raw
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001F\u007F<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_NAME_LENGTH)
    .trim()
  return clean.length >= 2 ? clean : null
}

/** Convierte el valor de `pases` en un entero entre 1 y `maxPases`; si no es válido devuelve `null`. */
export function sanitizePasses(raw: string | number | undefined | null, maxPases: number): number | null {
  if (raw === undefined || raw === null || raw === '') return null
  const n = typeof raw === 'number' ? raw : Number(String(raw).trim())
  if (!Number.isFinite(n)) return null
  const int = Math.floor(n)
  if (int < 1) return null
  return Math.min(int, maxPases)
}

export function parseGuestParams(query: Record<string, QueryValue>, limits: GuestLimits): GuestParams {
  const invitado = sanitizeGuestName(first(query.invitado))
  const pases = sanitizePasses(first(query.pases), limits.maxPases)
  return {
    invitado,
    pases: pases ?? limits.pasesPorDefecto,
    personalizada: invitado !== null || pases !== null,
  }
}

/** `/boda?invitado=Familia%20P%C3%A9rez&pases=4` — espacios como `%20` para que WhatsApp no corte el enlace. */
export function buildGuestPath(slug: string, guest: { invitado?: string | null, pases?: number | null }): string {
  const parts: string[] = []
  const name = sanitizeGuestName(guest.invitado)
  if (name) parts.push(`invitado=${encodeURIComponent(name)}`)
  if (guest.pases && guest.pases > 0) parts.push(`pases=${Math.floor(guest.pases)}`)
  return `/${slug}${parts.length ? `?${parts.join('&')}` : ''}`
}

export function buildGuestUrl(origin: string, slug: string, guest: { invitado?: string | null, pases?: number | null }): string {
  return `${origin.replace(/\/+$/, '')}${buildGuestPath(slug, guest)}`
}

/** Clave para comparar nombres sin importar mayúsculas, acentos ni espacios extra. */
export function normalizeName(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

/** "Pase" o "pases" según la cantidad. */
export function pasesLabel(n: number): string {
  return `${n} ${n === 1 ? 'pase' : 'pases'}`
}
