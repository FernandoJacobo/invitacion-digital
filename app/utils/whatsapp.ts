import type { InvitationConfig } from '~/events/types'
import { formatDeadline, formatLongDate, capitalize } from './dates'
import { eventPhrase, mainPlace } from './invitation'
import { pasesLabel } from './guest'
import type { RsvpData } from './rsvp'

/** Deja solo dígitos. Un número mexicano de 10 dígitos se completa con la lada internacional 52. */
export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  return digits.length === 10 ? `52${digits}` : digits
}

/** Enlace universal de WhatsApp (abre la app en móvil y WhatsApp Web en escritorio). */
export function whatsappUrl(phone: string | null | undefined, text: string): string {
  const base = phone ? `https://wa.me/${normalizePhone(phone)}` : 'https://wa.me/'
  return `${base}?text=${encodeURIComponent(text)}`
}

/** Mensaje de confirmación que el invitado envía al anfitrión. Usa el formato de WhatsApp (*negritas*). */
export function buildRsvpMessage(config: InvitationConfig, rsvp: RsvpData): string {
  const asiste = rsvp.asistencia === 'si'
  const lines = [
    `¡Hola, ${config.rsvp.contacto}! 💌`,
    asiste
      ? `Con mucho gusto confirmo mi asistencia a ${eventPhrase(config)}.`
      : `Muchas gracias por la invitación a ${eventPhrase(config)}. Lamentablemente no podré asistir.`,
    '',
    `*Nombre:* ${rsvp.nombre}`,
    `*Asistencia:* ${asiste ? '✅ Sí asistiré' : '❌ No podré asistir'}`,
  ]
  if (asiste) {
    lines.push(`*Personas:* ${rsvp.pases}`)
    if (rsvp.restricciones) lines.push(`*Restricciones alimenticias:* ${rsvp.restricciones}`)
  }
  if (rsvp.mensaje) lines.push('', `*Mensaje:* ${rsvp.mensaje}`)
  lines.push('', `— Enviado desde la invitación digital · ${capitalize(formatLongDate(config.fecha))}`)
  return lines.join('\n')
}

/** Mensaje con el que el anfitrión comparte la invitación personalizada. */
export function buildInvitationMessage(
  config: InvitationConfig,
  guest: { invitado?: string | null, pases?: number | null },
  url: string,
): string {
  const lugar = mainPlace(config)
  const saludo = guest.invitado ? `¡Hola, ${guest.invitado}! ✨` : '¡Hola! ✨'
  const pases = guest.pases ? ` (${pasesLabel(guest.pases)})` : ''
  return [
    saludo,
    `Con mucho cariño te invitamos a ${eventPhrase(config)}.`,
    '',
    `📅 ${capitalize(formatLongDate(config.fecha))}`,
    `📍 ${lugar.nombre}`,
    '',
    `Abre tu invitación${pases}:`,
    url,
    '',
    `Por favor confirma tu asistencia antes del ${formatDeadline(config.rsvp.fechaLimite)}.`,
  ].join('\n')
}
