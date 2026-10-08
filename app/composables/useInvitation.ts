import type { InjectionKey, Ref } from 'vue'
import type { InvitationConfig } from '~/events/types'
import type { GuestParams } from '~/utils/guest'

export interface InvitationContext {
  config: InvitationConfig
  guest: Ref<GuestParams>
  /** `true` cuando el sobre ya se abrió (arrancan animaciones, música y efectos). */
  opened: Ref<boolean>
}

const KEY: InjectionKey<InvitationContext> = Symbol('invitation')

export function provideInvitation(ctx: InvitationContext) {
  provide(KEY, ctx)
}

/** Config y estado de la invitación actual (lo provee la página `[slug].vue`). */
export function useInvitation(): InvitationContext {
  const ctx = inject(KEY)
  if (!ctx) throw new Error('useInvitation() debe usarse dentro de una invitación')
  return ctx
}

/** Variables CSS del tema para el contenedor de la invitación. */
export function themeStyle(config: InvitationConfig): Record<string, string> {
  const c = config.tema.colores
  const t = config.tema.tipografia
  return {
    '--c-fondo': c.fondo,
    '--c-superficie': c.superficie,
    '--c-superficie-alt': c.superficieAlt,
    '--c-tinta': c.tinta,
    '--c-tenue': c.tenue,
    '--c-primario': c.primario,
    '--c-sobre-primario': c.sobrePrimario,
    '--c-acento': c.acento,
    '--c-acento-tinta': c.acentoTinta,
    '--c-linea': c.linea,
    '--c-sobre': c.sobre,
    '--c-sobre-sombra': c.sobreSombra,
    '--c-sello': c.sello,
    '--f-display': `'${t.display}'`,
    '--f-script': `'${t.script}'`,
    '--f-cuerpo': `'${t.cuerpo}'`,
  }
}
