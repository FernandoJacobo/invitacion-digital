import { describe, expect, it } from 'vitest'
import { detectDelimiter, escapeCSVCell, parseGuestList, splitCSVLine, toCSV } from '~/utils/csv'

const limits = { pasesPorDefecto: 2, maxPases: 10 }

describe('parseGuestList', () => {
  it('acepta coma, punto y coma y tabulador', () => {
    const { guests } = parseGuestList('Familia Pérez, 4\nAna López;1\nTío Beto\t3', limits)
    expect(guests).toEqual([
      { nombre: 'Familia Pérez', pases: 4 },
      { nombre: 'Ana López', pases: 1 },
      { nombre: 'Tío Beto', pases: 3 },
    ])
  })

  it('ignora encabezado, líneas vacías y BOM', () => {
    const { guests } = parseGuestList('﻿nombre,pases\r\n\r\nLuis,2\r\n', limits)
    expect(guests).toEqual([{ nombre: 'Luis', pases: 2 }])
  })

  it('usa los pases por defecto cuando falta la columna', () => {
    expect(parseGuestList('Solo nombre', limits).guests).toEqual([{ nombre: 'Solo nombre', pases: 2 }])
  })

  it('respeta comillas con comas dentro', () => {
    expect(parseGuestList('"Pérez, Familia",5', limits).guests).toEqual([{ nombre: 'Pérez, Familia', pases: 5 }])
  })

  it('avisa sobre pases inválidos, excedidos y duplicados', () => {
    const { guests, warnings } = parseGuestList('Ana,abc\nLuis,40\nana,3\n,2', limits)
    expect(guests).toEqual([{ nombre: 'Ana', pases: 2 }, { nombre: 'Luis', pases: 10 }])
    expect(warnings.map(w => w.line)).toEqual([1, 2, 3, 4])
  })
})

describe('splitCSVLine', () => {
  it('maneja comillas escapadas', () => {
    expect(splitCSVLine('"Dice ""hola""",2')).toEqual(['Dice "hola"', '2'])
  })
  it('detecta el separador fuera de comillas', () => {
    expect(detectDelimiter('"a;b",2')).toBe(',')
    expect(detectDelimiter('a;2')).toBe(';')
  })
})

describe('toCSV', () => {
  it('escapa comillas, comas y saltos de línea', () => {
    expect(toCSV(['a', 'b'], [['x, y', 'dice "hola"'], ['línea\n2', 3]])).toBe('a,b\r\n"x, y","dice ""hola"""\r\n"línea\n2",3')
  })
  it('neutraliza fórmulas de Excel', () => {
    expect(escapeCSVCell('=HYPERLINK("x")')).toBe(`"'=HYPERLINK(""x"")"`)
    expect(escapeCSVCell('+52 33')).toBe(`'+52 33`)
  })
})
