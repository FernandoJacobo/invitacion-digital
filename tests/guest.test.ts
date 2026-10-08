import { describe, expect, it } from 'vitest'
import { buildGuestPath, buildGuestUrl, normalizeName, parseGuestParams, sanitizeGuestName, sanitizePasses } from '~/utils/guest'

const limits = { pasesPorDefecto: 2, maxPases: 10 }

describe('parseGuestParams', () => {
  it('lee invitado y pases de la URL', () => {
    expect(parseGuestParams({ invitado: 'Familia Perez', pases: '4' }, limits)).toEqual({ invitado: 'Familia Perez', pases: 4, personalizada: true })
  })

  it('sin parámetros devuelve una invitación genérica', () => {
    expect(parseGuestParams({}, limits)).toEqual({ invitado: null, pases: 2, personalizada: false })
  })

  it('acota los pases al máximo y descarta valores inválidos', () => {
    expect(parseGuestParams({ pases: '50' }, limits).pases).toBe(10)
    expect(parseGuestParams({ pases: '-3' }, limits)).toEqual({ invitado: null, pases: 2, personalizada: false })
    expect(parseGuestParams({ pases: 'abc' }, limits).pases).toBe(2)
    expect(parseGuestParams({ pases: '3.9' }, limits).pases).toBe(3)
  })

  it('toma el primer valor cuando el parámetro viene repetido', () => {
    expect(parseGuestParams({ invitado: ['Ana López', 'Otro'], pases: [null, '3'] }, limits)).toMatchObject({ invitado: 'Ana López', pases: 3 })
  })
})

describe('sanitizeGuestName', () => {
  it('quita etiquetas, controles y espacios extra', () => {
    expect(sanitizeGuestName('  <b>Familia</b>\n  Pérez ')).toBe('bFamilia/b Pérez')
  })
  it('limita a 60 caracteres', () => {
    expect(sanitizeGuestName('a'.repeat(100))).toHaveLength(60)
  })
  it('rechaza nombres vacíos o de una letra', () => {
    expect(sanitizeGuestName('  ')).toBeNull()
    expect(sanitizeGuestName('x')).toBeNull()
    expect(sanitizeGuestName(undefined)).toBeNull()
  })
})

describe('sanitizePasses', () => {
  it('acepta números y cadenas', () => {
    expect(sanitizePasses(3, 10)).toBe(3)
    expect(sanitizePasses(' 7 ', 10)).toBe(7)
  })
  it('devuelve null para vacíos o cero', () => {
    expect(sanitizePasses('', 10)).toBeNull()
    expect(sanitizePasses('0', 10)).toBeNull()
  })
})

describe('enlaces de invitado', () => {
  it('codifica espacios como %20 y acentos', () => {
    expect(buildGuestPath('boda', { invitado: 'Familia Pérez', pases: 4 })).toBe('/boda?invitado=Familia%20P%C3%A9rez&pases=4')
  })
  it('omite parámetros vacíos', () => {
    expect(buildGuestPath('xv', {})).toBe('/xv')
    expect(buildGuestPath('xv', { pases: 3 })).toBe('/xv?pases=3')
  })
  it('es reversible con parseGuestParams', () => {
    const path = buildGuestPath('boda', { invitado: 'Ana & Luis', pases: 2 })
    const query = Object.fromEntries(new URL(`https://x.dev${path}`).searchParams)
    expect(parseGuestParams(query, limits)).toMatchObject({ invitado: 'Ana & Luis', pases: 2 })
  })
  it('arma la URL absoluta sin dobles diagonales', () => {
    expect(buildGuestUrl('https://demo.pages.dev/', 'boda', { invitado: 'Ana', pases: 1 })).toBe('https://demo.pages.dev/boda?invitado=Ana&pases=1')
  })
})

it('normalizeName ignora acentos, mayúsculas y espacios', () => {
  expect(normalizeName('  Familia  PÉREZ ')).toBe(normalizeName('familia perez'))
})
