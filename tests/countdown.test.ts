import { describe, expect, it } from 'vitest'
import { getCountdown, pad2 } from '~/utils/countdown'

describe('getCountdown', () => {
  const target = '2027-04-17T17:00:00-06:00'

  it('desglosa días, horas, minutos y segundos', () => {
    const now = new Date('2027-04-15T15:58:30-06:00')
    expect(getCountdown(target, now)).toMatchObject({ days: 2, hours: 1, minutes: 1, seconds: 30, done: false })
  })

  it('respeta la zona horaria del ISO aunque `now` venga en UTC', () => {
    const now = new Date('2027-04-17T22:59:59Z') // 16:59:59 en CDMX
    expect(getCountdown(target, now)).toMatchObject({ days: 0, hours: 0, minutes: 0, seconds: 1, done: false })
  })

  it('marca `done` y no devuelve negativos cuando la fecha ya pasó', () => {
    const c = getCountdown(target, new Date('2028-01-01T00:00:00Z'))
    expect(c).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0, done: true })
  })

  it('acepta timestamps numéricos', () => {
    const t = new Date(target)
    expect(getCountdown(t, t.getTime() - 90_061_000)).toMatchObject({ days: 1, hours: 1, minutes: 1, seconds: 1 })
  })

  it('pad2 rellena con cero', () => {
    expect(pad2(5)).toBe('05')
    expect(pad2(123)).toBe('123')
  })
})
