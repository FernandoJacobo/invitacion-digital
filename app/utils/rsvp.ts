import { z } from 'zod'

export type Asistencia = 'si' | 'no'

export interface RsvpResponse {
  id: string
  /** Slug del evento. */
  evento: string
  nombre: string
  asistencia: Asistencia
  /** Personas que asistirán (0 si no asiste). */
  pases: number
  /** Pases asignados en la invitación. */
  pasesAsignados: number
  restricciones: string
  mensaje: string
  /** Nombre del invitado que venía en el enlace (si lo había). */
  invitado: string | null
  creado: number
  actualizado: number
  /** Generada con "Cargar confirmaciones de ejemplo". */
  ejemplo?: boolean
}

export interface RsvpInput {
  nombre: string
  asistencia: Asistencia | null
  pases: number
  restricciones: string
  mensaje: string
}

export type RsvpField = keyof RsvpInput
export type RsvpErrors = Partial<Record<RsvpField, string>>

export function createRsvpSchema(maxPases: number) {
  return z
    .object({
      nombre: z
        .string()
        .trim()
        .min(3, 'Escribe tu nombre o el de tu familia.')
        .max(80, 'Usa máximo 80 caracteres.'),
      asistencia: z.enum(['si', 'no'], { error: 'Cuéntanos si podrás acompañarnos.' }),
      pases: z.number({ error: 'Indica cuántas personas asistirán.' }).int(),
      restricciones: z.string().trim().max(160, 'Usa máximo 160 caracteres.'),
      mensaje: z.string().trim().max(500, 'Usa máximo 500 caracteres.'),
    })
    .superRefine((value, ctx) => {
      if (value.asistencia !== 'si') return
      if (value.pases < 1) {
        ctx.addIssue({ code: 'custom', path: ['pases'], message: 'Debe asistir al menos 1 persona.' })
      }
      else if (value.pases > maxPases) {
        ctx.addIssue({
          code: 'custom',
          path: ['pases'],
          message: `Tu invitación incluye ${maxPases} ${maxPases === 1 ? 'pase' : 'pases'}.`,
        })
      }
    })
    .transform(value => ({
      ...value,
      pases: value.asistencia === 'si' ? value.pases : 0,
      restricciones: value.asistencia === 'si' ? value.restricciones : '',
    }))
}

export type RsvpData = z.output<ReturnType<typeof createRsvpSchema>>

export function validateRsvp(
  input: RsvpInput,
  maxPases: number,
): { ok: true, data: RsvpData, errors: RsvpErrors } | { ok: false, errors: RsvpErrors } {
  const result = createRsvpSchema(maxPases).safeParse(input)
  if (result.success) return { ok: true, data: result.data, errors: {} }
  const errors: RsvpErrors = {}
  for (const issue of result.error.issues) {
    const field = issue.path[0] as RsvpField | undefined
    if (field && !errors[field]) errors[field] = issue.message
  }
  return { ok: false, errors }
}

export function createId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}
