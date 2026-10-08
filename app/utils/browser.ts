/** Descarga un archivo de texto generado en el cliente. */
export function downloadFile(filename: string, content: string, mime: string): void {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

const BOM = String.fromCharCode(0xFEFF)

/** CSV con BOM para que Excel en español respete acentos. */
export function downloadCSV(filename: string, csv: string): void {
  downloadFile(filename.endsWith('.csv') ? filename : `${filename}.csv`, `${BOM}${csv}`, 'text/csv;charset=utf-8')
}

/** Copia texto al portapapeles con respaldo para navegadores sin Clipboard API (http, WebViews). */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }
  }
  catch {
    // Continúa con el respaldo.
  }
  const area = document.createElement('textarea')
  area.value = text
  area.setAttribute('readonly', '')
  area.style.position = 'fixed'
  area.style.opacity = '0'
  document.body.appendChild(area)
  area.select()
  let ok: boolean
  try {
    ok = document.execCommand('copy')
  }
  catch {
    ok = false
  }
  area.remove()
  return ok
}

/** Nombre de archivo seguro: "Boda Valeria & Santiago" → "boda-valeria-santiago". */
export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
