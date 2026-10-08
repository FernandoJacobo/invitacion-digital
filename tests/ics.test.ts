import { describe, expect, it } from 'vitest'
import { buildICS, escapeICSText, foldICSLine, googleCalendarUrl, outlookCalendarUrl, toICSUtc } from '~/utils/ics'

const event = {
  uid: 'boda-ceremonia@invitacion-digital',
  title: 'Boda Valeria & Santiago · Ceremonia',
  description: 'Capilla de San Miguel\nTe esperamos, con cariño; V & S',
  location: 'Camino Real a Cajititlán km 4.5, Tlajomulco, Jal.',
  start: '2027-04-17T17:00:00-06:00',
  durationMin: 60,
}

describe('buildICS', () => {
  const ics = buildICS(event, new Date('2026-10-08T12:00:00Z'))

  it('usa CRLF y termina con salto de línea', () => {
    expect(ics.endsWith('\r\n')).toBe(true)
    expect(ics.replace(/\r\n/g, '')).not.toContain('\n')
  })

  it('convierte la hora de CDMX a UTC', () => {
    expect(ics).toContain('DTSTART:20270417T230000Z')
    expect(ics).toContain('DTEND:20270418T000000Z')
    expect(ics).toContain('DTSTAMP:20261008T120000Z')
  })

  it('incluye la estructura mínima de VCALENDAR/VEVENT', () => {
    for (const line of ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:', 'BEGIN:VEVENT', `UID:${event.uid}`, 'END:VEVENT', 'END:VCALENDAR']) {
      expect(ics).toContain(line)
    }
  })

  it('escapa comas, punto y coma y saltos de línea', () => {
    expect(ics.replace(/\r\n /g, '')).toContain('DESCRIPTION:Capilla de San Miguel\\nTe esperamos\\, con cariño\\; V & S')
  })

  it('ninguna línea supera 75 octetos', () => {
    const enc = new TextEncoder()
    for (const line of ics.split('\r\n')) expect(enc.encode(line).length).toBeLessThanOrEqual(75)
  })
})

describe('auxiliares', () => {
  it('escapeICSText escapa diagonales invertidas', () => {
    expect(escapeICSText('a\\b')).toBe('a\\\\b')
  })
  it('foldICSLine no parte caracteres multibyte', () => {
    const folded = foldICSLine(`SUMMARY:${'ñ'.repeat(60)}`)
    expect(folded.split('\r\n ').join('')).toBe(`SUMMARY:${'ñ'.repeat(60)}`)
  })
  it('toICSUtc formatea sin milisegundos', () => {
    expect(toICSUtc(new Date('2027-01-02T03:04:05.678Z'))).toBe('20270102T030405Z')
  })
  it('googleCalendarUrl incluye fechas UTC y título', () => {
    const url = new URL(googleCalendarUrl(event))
    expect(url.searchParams.get('dates')).toBe('20270417T230000Z/20270418T000000Z')
    expect(url.searchParams.get('text')).toBe(event.title)
  })
  it('outlookCalendarUrl incluye inicio y fin ISO', () => {
    const url = new URL(outlookCalendarUrl(event))
    expect(url.searchParams.get('startdt')).toBe('2027-04-17T23:00:00.000Z')
    expect(url.searchParams.get('enddt')).toBe('2027-04-18T00:00:00.000Z')
  })
})
