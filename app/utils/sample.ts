import type { RsvpResponse } from './rsvp'

export interface GuestEntry {
  id: string
  evento: string
  nombre: string
  pases: number
  creado: number
  ejemplo?: boolean
}

interface SampleSeed {
  nombre: string
  pases: number
  /** `si`, `no` o `null` (pendiente: solo está en la lista de invitados). */
  respuesta: 'si' | 'no' | null
  asisten?: number
  restricciones?: string
  mensaje?: string
}

const BODA: SampleSeed[] = [
  { nombre: 'Familia Pérez Gutiérrez', pases: 4, respuesta: 'si', asisten: 4, restricciones: '1 vegetariano', mensaje: '¡Felicidades! Ahí estaremos con mucho gusto.' },
  { nombre: 'Carlos y Ana Zúñiga', pases: 2, respuesta: 'si', asisten: 2, mensaje: 'No nos lo perdemos por nada.' },
  { nombre: 'Tía Lupita', pases: 1, respuesta: 'si', asisten: 1, restricciones: 'Sin azúcar', mensaje: 'Mis niños hermosos, los quiero mucho.' },
  { nombre: 'Familia Ramírez Ochoa', pases: 5, respuesta: 'si', asisten: 3, mensaje: 'Vamos 3, los niños se quedan con la abuela.' },
  { nombre: 'Mariana Lozano', pases: 2, respuesta: 'no', mensaje: 'Estaré fuera del país, les mando un abrazo enorme.' },
  { nombre: 'Jorge y Paty Villalobos', pases: 2, respuesta: 'si', asisten: 2, restricciones: 'Alergia a mariscos' },
  { nombre: 'Familia Hernández Cruz', pases: 4, respuesta: 'si', asisten: 4 },
  { nombre: 'Daniel Ortega', pases: 2, respuesta: 'si', asisten: 1, mensaje: '¡Qué emoción! Voy solo, nos vemos en la pista.' },
  { nombre: 'Sofía y Rodrigo Medina', pases: 2, respuesta: 'no', mensaje: 'Coincide con el bautizo de nuestra bebé. ¡Muchas felicidades!' },
  { nombre: 'Familia Castillo Rubio', pases: 3, respuesta: 'si', asisten: 3, restricciones: 'Sin gluten (1)' },
  { nombre: 'Ingrid Valadez', pases: 1, respuesta: 'si', asisten: 1, restricciones: 'Vegana' },
  { nombre: 'Familia Navarro Íñiguez', pases: 4, respuesta: null },
  { nombre: 'Luis Fernando Tapia', pases: 2, respuesta: null },
  { nombre: 'Compañeros de la oficina', pases: 6, respuesta: null },
]

const XV: SampleSeed[] = [
  { nombre: 'Familia Aguilar Mora', pases: 4, respuesta: 'si', asisten: 4, mensaje: '¡Mar, vas a estar preciosa!' },
  { nombre: 'Valentina Ochoa', pases: 1, respuesta: 'si', asisten: 1, mensaje: '¡Lista para el vals! 💃' },
  { nombre: 'Familia Torres Delgado', pases: 3, respuesta: 'si', asisten: 3, restricciones: 'Vegetariano (1)' },
  { nombre: 'Abuelita Carmen', pases: 2, respuesta: 'si', asisten: 2, restricciones: 'Comida baja en sal' },
  { nombre: 'Familia Robles Fuentes', pases: 4, respuesta: 'no', mensaje: 'Tenemos boda ese mismo día, ¡muchas felicidades, Mar!' },
  { nombre: 'Maestra Elena Quiroz', pases: 1, respuesta: 'si', asisten: 1 },
  { nombre: 'Familia Pacheco Lara', pases: 5, respuesta: 'si', asisten: 4 },
  { nombre: 'Andrés Castañeda', pases: 2, respuesta: 'no' },
  { nombre: 'Primos Herrera', pases: 4, respuesta: 'si', asisten: 4, mensaje: '¡A darle con todo en la fiesta!' },
  { nombre: 'Familia Montes Salazar', pases: 3, respuesta: null },
  { nombre: 'Equipo de danza', pases: 6, respuesta: null },
]

/** Pseudoaleatorio determinista para que la demo se vea igual en cada presentación. */
function seeded(seed: number) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296
    return s / 4294967296
  }
}

/** Genera invitados y ~20 confirmaciones ficticias con fechas de los últimos días. */
export function buildSampleData(now: number = Date.now()): { guests: GuestEntry[], responses: RsvpResponse[] } {
  const rand = seeded(15)
  const guests: GuestEntry[] = []
  const responses: RsvpResponse[] = []

  const add = (evento: string, seeds: SampleSeed[]) => {
    seeds.forEach((seed, i) => {
      const creado = now - Math.round((12 + rand() * 6) * 86_400_000)
      guests.push({ id: `ejemplo-g-${evento}-${i}`, evento, nombre: seed.nombre, pases: seed.pases, creado, ejemplo: true })
      if (!seed.respuesta) return
      const respondio = now - Math.round(rand() * 10 * 86_400_000 + rand() * 3_600_000)
      responses.push({
        id: `ejemplo-r-${evento}-${i}`,
        evento,
        nombre: seed.nombre,
        invitado: seed.nombre,
        asistencia: seed.respuesta,
        pases: seed.respuesta === 'si' ? (seed.asisten ?? seed.pases) : 0,
        pasesAsignados: seed.pases,
        restricciones: seed.restricciones ?? '',
        mensaje: seed.mensaje ?? '',
        creado: respondio,
        actualizado: respondio,
        ejemplo: true,
      })
    })
  }

  add('boda', BODA)
  add('xv', XV)
  responses.sort((a, b) => b.actualizado - a.actualizado)
  return { guests, responses }
}
