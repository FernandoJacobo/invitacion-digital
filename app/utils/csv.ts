import { sanitizeGuestName, sanitizePasses } from './guest'

export interface ParsedGuest {
  nombre: string
  pases: number
}

export interface GuestListResult {
  guests: ParsedGuest[]
  /** Avisos no bloqueantes por línea (1-indexada). */
  warnings: { line: number, message: string }[]
}

/** Elige el separador de una línea: tabulador (pegado desde Excel/Sheets), punto y coma o coma. */
export function detectDelimiter(line: string): string {
  if (line.includes('\t')) return '\t'
  // Si hay comillas, las comas dentro no cuentan: se busca fuera de ellas.
  const outside = line.replace(/"[^"]*"/g, '')
  if (outside.includes(';')) return ';'
  return ','
}

/** Divide una línea CSV respetando comillas dobles y comillas escapadas (`""`). */
export function splitCSVLine(line: string, delimiter = detectDelimiter(line)): string[] {
  const cells: string[] = []
  let current = ''
  let quoted = false
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (quoted) {
      if (char === '"' && line[i + 1] === '"') {
        current += '"'
        i++
      }
      else if (char === '"') quoted = false
      else current += char
    }
    else if (char === '"') quoted = true
    else if (char === delimiter) {
      cells.push(current)
      current = ''
    }
    else current += char
  }
  cells.push(current)
  return cells.map(c => c.trim())
}

const HEADER = /^(nombre|invitados?|name|familia)$/i

/**
 * Convierte texto pegado o un CSV en una lista de invitados.
 * Acepta `Nombre, pases`, `Nombre;pases`, columnas separadas por tabulador o solo el nombre.
 * Ignora líneas vacías, encabezados y duplicados exactos.
 */
export function parseGuestList(text: string, limits: { pasesPorDefecto: number, maxPases: number }): GuestListResult {
  const guests: ParsedGuest[] = []
  const warnings: GuestListResult['warnings'] = []
  const seen = new Set<string>()
  const lines = text.replace(/^﻿/, '').split(/\r?\n/)

  lines.forEach((raw, index) => {
    const lineNumber = index + 1
    if (!raw.trim()) return
    const [nameCell = '', passesCell = ''] = splitCSVLine(raw)
    if (index === 0 && HEADER.test(nameCell)) return

    const nombre = sanitizeGuestName(nameCell)
    if (!nombre) {
      warnings.push({ line: lineNumber, message: 'Sin nombre válido; se omitió.' })
      return
    }

    let pases = limits.pasesPorDefecto
    if (passesCell) {
      const parsed = sanitizePasses(passesCell, limits.maxPases)
      if (parsed === null) {
        warnings.push({ line: lineNumber, message: `"${passesCell}" no es un número de pases; se usaron ${pases}.` })
      }
      else {
        if (Number(passesCell) > limits.maxPases) {
          warnings.push({ line: lineNumber, message: `Máximo ${limits.maxPases} pases; se ajustó.` })
        }
        pases = parsed
      }
    }

    const key = nombre.toLowerCase()
    if (seen.has(key)) {
      warnings.push({ line: lineNumber, message: `"${nombre}" está repetido; se omitió.` })
      return
    }
    seen.add(key)
    guests.push({ nombre, pases })
  })

  return { guests, warnings }
}

/** Escapa una celda CSV y neutraliza fórmulas (`=`, `+`, `-`, `@`) para abrirla segura en Excel. */
export function escapeCSVCell(value: string | number | null | undefined): string {
  let text = value === null || value === undefined ? '' : String(value)
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`
  return /[",\r\n;]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

/** Arma un CSV (CRLF) a partir de encabezados y filas. */
export function toCSV(headers: string[], rows: (string | number | null | undefined)[][]): string {
  return [headers, ...rows].map(row => row.map(escapeCSVCell).join(',')).join('\r\n')
}
