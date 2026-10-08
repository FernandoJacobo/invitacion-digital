import type { InvitationConfig, Lugar } from '~/events/types'

/** "la boda de Valeria & Santiago" / "los XV años de Mariana Sofía" */
export function eventPhrase(config: InvitationConfig): string {
  return config.tipo === 'boda' ? `la boda de ${config.titulo}` : `los XV años de ${config.titulo}`
}

/** "Boda" / "XV años" */
export function eventKind(config: Pick<InvitationConfig, 'tipo'>): string {
  return config.tipo === 'boda' ? 'Boda' : 'XV años'
}

/** Lugar principal (ceremonia si existe, si no recepción). */
export function mainPlace(config: InvitationConfig): Lugar {
  return config.ceremonia ?? config.recepcion
}

export function googleMapsUrl(lugar: Lugar): string {
  if (lugar.mapsUrl) return lugar.mapsUrl
  const { lat, lng } = lugar.coordenadas
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
}

export function wazeUrl(lugar: Lugar): string {
  const { lat, lng } = lugar.coordenadas
  return `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`
}
