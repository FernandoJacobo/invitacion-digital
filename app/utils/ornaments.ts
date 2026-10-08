/** Trazos SVG compartidos entre los componentes y la portada estática (viewBox 0 0 100 100). */

/** Borde irregular de un sello de cera: círculo con perturbaciones senoidales. */
export function waxSealPath(): string {
  const pts: string[] = []
  const n = 72
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI * 2
    const r = 45 + 2.2 * Math.sin(a * 7) + 1.4 * Math.sin(a * 13 + 1) + 0.8 * Math.sin(a * 23)
    pts.push(`${(50 + r * Math.cos(a)).toFixed(2)} ${(50 + r * Math.sin(a)).toFixed(2)}`)
  }
  return `M${pts.join('L')}Z`
}

/** Estrella de ocho puntas del broche de XV. */
export function starBurstPath(): string {
  const pts: string[] = []
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2 - Math.PI / 2
    const r = i % 2 === 0 ? (i % 4 === 0 ? 30 : 20) : 7
    pts.push(`${(50 + r * Math.cos(a)).toFixed(2)} ${(50 + r * Math.sin(a)).toFixed(2)}`)
  }
  return `M${pts.join('L')}Z`
}

/** Monograma del sello: iniciales de los novios, "XV" o la inicial del título. */
export function monogramFor(config: { tipo: string, titulo: string, novios?: { ella: { nombre: string }, el: { nombre: string } } }): string {
  if (config.novios) return `${config.novios.ella.nombre.charAt(0)}${config.novios.el.nombre.charAt(0)}`
  if (config.tipo === 'xv') return 'XV'
  return config.titulo.charAt(0)
}

/** Estrellas del fondo nocturno con posiciones fijas (sin aleatoriedad para que no "salten"). */
export function nightStars(count = 26) {
  return Array.from({ length: count }, (_, i) => ({
    left: `${(i * 37.3) % 100}%`,
    top: `${(i * 61.7 + 7) % 100}%`,
    size: 1 + ((i * 7) % 3),
    delay: `${(i * 0.37) % 4}s`,
  }))
}
