import { buildSampleData } from '~/utils/sample'

/** Acciones de la demo: restablecer todo y cargar datos de ejemplo. */
export function useDemo() {
  const rsvp = useRsvpStore()
  const guests = useGuestsStore()

  /**
   * Deja la demo como recién instalada: borra confirmaciones, invitados y preferencias (música)
   * guardadas en este navegador. Conserva la sesión del panel para no interrumpir una presentación.
   */
  function resetDemo() {
    rsvp.reset()
    guests.reset()
    try {
      for (const key of Object.keys(localStorage)) {
        if (key.startsWith('inv-') && key !== 'inv-auth' && key !== 'inv-rsvp' && key !== 'inv-guests') localStorage.removeItem(key)
      }
      sessionStorage.clear()
    }
    catch {
      // Almacenamiento bloqueado (modo privado): no hay nada que limpiar.
    }
  }

  function loadSamples() {
    const { guests: g, responses } = buildSampleData()
    guests.addSamples(g)
    rsvp.addSamples(responses)
    return responses.length
  }

  return { resetDemo, loadSamples }
}
