import { expect, it } from 'vitest'
import { formatDeadline, formatHHMM, formatLongDate, formatTime, wallClock } from '~/utils/dates'
import { buildSampleData } from '~/utils/sample'
import { events } from '~/events'

it('formatea fechas y horas en español con la hora local del evento', () => {
  expect(formatLongDate('2027-04-17T17:00:00-06:00')).toBe('sábado 17 de abril de 2027')
  expect(formatTime('2027-04-17T19:30:00-06:00')).toBe('7:30 p.m.')
  expect(formatHHMM('09:05')).toBe('9:05 a.m.')
  expect(formatDeadline('2027-03-20')).toBe('20 de marzo de 2027')
  expect(wallClock('2027-04-17T17:00:00-06:00').getHours()).toBe(17)
})

it('los eventos registrados tienen slugs únicos y datos coherentes', () => {
  const slugs = events.map(e => e.slug)
  expect(new Set(slugs).size).toBe(slugs.length)
  for (const e of events) {
    expect(e.slug).toMatch(/^[a-z0-9-]+$/)
    expect(Number.isNaN(new Date(e.fecha).getTime())).toBe(false)
    expect(e.rsvp.pasesPorDefecto).toBeLessThanOrEqual(e.rsvp.maxPases)
    expect(wallClock(e.fecha).getDay()).toBe(6) // ambos demos caen en sábado
  }
})

it('los datos de ejemplo traen 20 confirmaciones y algunos pendientes', () => {
  const { guests, responses } = buildSampleData(Date.UTC(2026, 9, 8))
  expect(responses).toHaveLength(20)
  expect(guests.length).toBeGreaterThan(responses.length)
  expect(responses.every(r => (r.asistencia === 'no' ? r.pases === 0 : r.pases > 0))).toBe(true)
})
