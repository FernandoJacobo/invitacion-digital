import { describe, expect, it } from 'vitest'
import { bodaDemo } from '~/events/boda-demo'
import { xvDemo } from '~/events/xv-demo'
import { buildInvitationMessage, buildRsvpMessage, normalizePhone, whatsappUrl } from '~/utils/whatsapp'

describe('whatsappUrl', () => {
  it('normaliza el teléfono y codifica el texto', () => {
    expect(whatsappUrl('+52 (33) 1234-5678', 'Hola & adiós')).toBe('https://wa.me/523312345678?text=Hola%20%26%20adi%C3%B3s')
  })
  it('sin teléfono deja elegir el contacto', () => {
    expect(whatsappUrl(null, 'x')).toBe('https://wa.me/?text=x')
  })
  it('agrega la lada 52 a números de 10 dígitos', () => {
    expect(normalizePhone('33 1234 5678')).toBe('523312345678')
    expect(normalizePhone('5213312345678')).toBe('5213312345678')
  })
})

describe('buildRsvpMessage', () => {
  it('confirma asistencia con pases y restricciones', () => {
    const msg = buildRsvpMessage(bodaDemo, { nombre: 'Familia Pérez', asistencia: 'si', pases: 4, restricciones: 'Vegetariano', mensaje: '¡Felicidades!' })
    expect(msg).toContain('¡Hola, Valeria y Santiago!')
    expect(msg).toContain('confirmo mi asistencia a la boda de Valeria & Santiago')
    expect(msg).toContain('*Personas:* 4')
    expect(msg).toContain('*Restricciones alimenticias:* Vegetariano')
    expect(msg).toContain('*Mensaje:* ¡Felicidades!')
  })

  it('declina sin listar personas ni restricciones', () => {
    const msg = buildRsvpMessage(xvDemo, { nombre: 'Ana', asistencia: 'no', pases: 0, restricciones: '', mensaje: '' })
    expect(msg).toContain('los XV años de Mariana Sofía')
    expect(msg).toContain('No podré asistir')
    expect(msg).not.toContain('*Personas:*')
    expect(msg).not.toContain('*Mensaje:*')
  })
})

describe('buildInvitationMessage', () => {
  it('incluye saludo, fecha, lugar, pases y enlace', () => {
    const msg = buildInvitationMessage(bodaDemo, { invitado: 'Familia Pérez', pases: 4 }, 'https://x.dev/boda?pases=4')
    expect(msg).toContain('¡Hola, Familia Pérez!')
    expect(msg).toContain('Sábado 17 de abril de 2027')
    expect(msg).toContain('Capilla de San Miguel')
    expect(msg).toContain('(4 pases)')
    expect(msg).toContain('https://x.dev/boda?pases=4')
    expect(msg).toContain('20 de marzo de 2027')
  })
})
