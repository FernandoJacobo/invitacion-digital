<script setup lang="ts">
import type { IconoMomento } from '~/events/types'

/** Itinerario del día en línea de tiempo con íconos. */
const { config } = useInvitation()

const ICONS: Record<IconoMomento, string> = {
  iglesia: 'lucide:church',
  anillos: 'lucide:gem',
  copas: 'lucide:wine',
  cena: 'lucide:utensils',
  vals: 'lucide:music-2',
  baile: 'lucide:disc-3',
  pastel: 'lucide:cake',
  foto: 'lucide:camera',
  musica: 'lucide:music-4',
  corona: 'lucide:crown',
  zapatilla: 'lucide:sparkles',
  brindis: 'lucide:wine',
  fiesta: 'lucide:party-popper',
  luna: 'lucide:moon-star',
  llegada: 'lucide:door-open',
}
</script>

<template>
  <InvitationSection id="itinerario" alt eyebrow="Así será el día" title="Itinerario" narrow>
    <ol class="relative">
      <span class="absolute bottom-6 left-[27px] top-6 w-px bg-line" aria-hidden="true" />
      <li
        v-for="(momento, i) in config.itinerario"
        :key="momento.hora + momento.titulo"
        v-reveal="i * 70"
        class="relative flex items-start gap-5 py-3"
      >
        <span class="relative z-10 grid size-14 shrink-0 place-items-center rounded-full border border-line bg-surface text-accent-ink shadow-sm">
          <Icon :name="ICONS[momento.icono]" class="size-6" />
        </span>
        <div class="pt-1.5">
          <p class="font-display text-2xl font-semibold leading-none tabular-nums text-accent-ink">
            {{ formatHHMM(momento.hora) }}
          </p>
          <p class="mt-1.5 font-medium text-ink">
            {{ momento.titulo }}
          </p>
          <p v-if="momento.descripcion" class="text-sm text-muted">
            {{ momento.descripcion }}
          </p>
        </div>
      </li>
    </ol>
  </InvitationSection>
</template>
