import { defineStore } from 'pinia'
import type { RsvpData, RsvpResponse } from '~/utils/rsvp'
import { createId } from '~/utils/id'

/**
 * Confirmaciones guardadas en `localStorage` (sin backend).
 * `mine` recuerda qué respuesta envió este navegador en cada evento para poder mostrarla y modificarla.
 */
export const useRsvpStore = defineStore('rsvp', {
  state: () => ({
    responses: [] as RsvpResponse[],
    mine: {} as Record<string, string>,
  }),

  getters: {
    byEvent: state => (slug: string) => state.responses.filter(r => r.evento === slug),
    mineFor: state => (slug: string) => {
      const id = state.mine[slug]
      return id ? state.responses.find(r => r.id === id) : undefined
    },
  },

  actions: {
    /** Crea o actualiza la respuesta de este navegador para el evento. */
    submit(slug: string, data: RsvpData, meta: { invitado: string | null, pasesAsignados: number }): RsvpResponse {
      const now = Date.now()
      const existing = this.mineFor(slug)
      if (existing) {
        Object.assign(existing, data, { invitado: meta.invitado, pasesAsignados: meta.pasesAsignados, actualizado: now })
        // Lo más reciente primero.
        this.responses = [existing, ...this.responses.filter(r => r.id !== existing.id)]
        return existing
      }
      const response: RsvpResponse = {
        id: createId(),
        evento: slug,
        ...data,
        invitado: meta.invitado,
        pasesAsignados: meta.pasesAsignados,
        creado: now,
        actualizado: now,
      }
      this.responses.unshift(response)
      this.mine[slug] = response.id
      return response
    },

    remove(id: string) {
      this.responses = this.responses.filter(r => r.id !== id)
      this.mine = Object.fromEntries(Object.entries(this.mine).filter(([, mineId]) => mineId !== id))
    },

    addSamples(samples: RsvpResponse[]) {
      const ids = new Set(this.responses.map(r => r.id))
      this.responses = [...samples.filter(s => !ids.has(s.id)), ...this.responses].sort((a, b) => b.actualizado - a.actualizado)
    },

    reset() {
      this.responses = []
      this.mine = {}
    },
  },

  persist: { key: 'inv-rsvp' },
})
