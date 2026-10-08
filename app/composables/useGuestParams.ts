import type { InvitationConfig } from '~/events/types'
import { parseGuestParams } from '~/utils/guest'

/** Lee `?invitado=…&pases=…` de la URL actual, ya saneados y acotados al máximo del evento. */
export function useGuestParams(config: InvitationConfig) {
  const route = useRoute()
  return computed(() => parseGuestParams(route.query, config.rsvp))
}
