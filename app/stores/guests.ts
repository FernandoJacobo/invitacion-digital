import { defineStore } from 'pinia'
import type { GuestEntry } from '~/utils/sample'
import { normalizeName } from '~/utils/guest'
import { createId } from '~/utils/rsvp'

/** Lista de invitados creada desde el generador de enlaces del panel. */
export const useGuestsStore = defineStore('guests', {
  state: () => ({
    guests: [] as GuestEntry[],
  }),

  actions: {
    /** Agrega invitados; si el nombre ya existe en ese evento, actualiza sus pases. Devuelve cuántos son nuevos. */
    add(evento: string, list: { nombre: string, pases: number }[]): number {
      let added = 0
      const now = Date.now()
      for (const item of list) {
        const key = normalizeName(item.nombre)
        const existing = this.guests.find(g => g.evento === evento && normalizeName(g.nombre) === key)
        if (existing) {
          existing.pases = item.pases
          continue
        }
        this.guests.unshift({ id: createId(), evento, nombre: item.nombre, pases: item.pases, creado: now })
        added++
      }
      return added
    },

    remove(id: string) {
      this.guests = this.guests.filter(g => g.id !== id)
    },

    addSamples(samples: GuestEntry[]) {
      const ids = new Set(this.guests.map(g => g.id))
      this.guests = [...this.guests, ...samples.filter(s => !ids.has(s.id))]
    },

    reset() {
      this.guests = []
    },
  },

  persist: { key: 'inv-guests' },
})
