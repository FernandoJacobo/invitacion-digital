import { toast } from 'vue-sonner'
import { getEvent } from '~/events'

/**
 * Sincroniza los stores entre pestañas con el evento `storage`.
 * Si alguien confirma en la invitación, la respuesta aparece en el panel abierto en otra pestaña con un aviso.
 */
export default defineNuxtPlugin(() => {
  const router = useRouter()
  const rsvp = useRsvpStore()
  const guests = useGuestsStore()
  const auth = useAuthStore()

  window.addEventListener('storage', (event) => {
    // `key === null` significa que se limpió todo el storage (p. ej. "Restablecer demo").
    if (event.key === null) {
      rsvp.$hydrate()
      guests.$hydrate()
      auth.$hydrate()
      return
    }
    if (event.key === 'inv-guests') return guests.$hydrate()
    if (event.key === 'inv-auth') return auth.$hydrate()
    if (event.key !== 'inv-rsvp') return

    const before = new Map(rsvp.responses.map(r => [r.id, r.actualizado]))
    rsvp.$hydrate()

    if (!router.currentRoute.value.path.startsWith('/admin')) return
    for (const r of rsvp.responses) {
      const prev = before.get(r.id)
      if (prev === r.actualizado) continue
      const evento = getEvent(r.evento)
      const detalle = r.asistencia === 'si' ? `Asistirá · ${r.pases} ${r.pases === 1 ? 'persona' : 'personas'}` : 'No podrá asistir'
      toast(prev === undefined ? `Nueva confirmación: ${r.nombre}` : `Respuesta actualizada: ${r.nombre}`, {
        description: `${evento ? eventKind(evento) : r.evento} · ${detalle}`,
      })
    }
  })
})
