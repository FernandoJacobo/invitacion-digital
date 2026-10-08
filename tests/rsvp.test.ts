import { describe, expect, it } from 'vitest'
import { validateRsvp } from '~/utils/rsvp'

const base = { nombre: 'Familia Pérez', asistencia: 'si' as const, pases: 2, restricciones: '', mensaje: '' }

describe('validateRsvp', () => {
  it('acepta una confirmación válida', () => {
    expect(validateRsvp(base, 4).ok).toBe(true)
  })

  it('exige nombre y asistencia', () => {
    const r = validateRsvp({ ...base, nombre: ' a ', asistencia: null }, 4)
    expect(r.ok).toBe(false)
    expect(Object.keys(r.errors).sort()).toEqual(['asistencia', 'nombre'])
  })

  it('limita los pases al máximo de la invitación', () => {
    const r = validateRsvp({ ...base, pases: 5 }, 4)
    expect(r.ok).toBe(false)
    expect(r.errors.pases).toBe('Tu invitación incluye 4 pases.')
  })

  it('si no asiste, ignora pases y restricciones', () => {
    const r = validateRsvp({ ...base, asistencia: 'no', pases: 99, restricciones: 'x' }, 4)
    expect(r.ok && r.data).toMatchObject({ pases: 0, restricciones: '' })
  })
})
