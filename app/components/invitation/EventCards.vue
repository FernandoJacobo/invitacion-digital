<script setup lang="ts">
import type { Lugar } from '~/events/types'

/** Tarjetas de ceremonia y recepción con "Cómo llegar" y "Agregar al calendario". */
const { config } = useInvitation()
const lugares = [config.ceremonia, config.recepcion].filter(Boolean) as Lugar[]
</script>

<template>
  <InvitationSection id="detalles" eyebrow="¿Cuándo y dónde?" title="Detalles del evento">
    <div class="grid gap-6 md:grid-cols-2" :class="lugares.length === 1 ? 'mx-auto max-w-md md:grid-cols-1' : ''">
      <article
        v-for="(lugar, i) in lugares"
        :key="lugar.titulo"
        v-reveal="i * 140"
        class="card flex flex-col"
      >
        <UiSmartImage
          v-if="lugar.imagen"
          :src="lugar.imagen.src"
          :alt="lugar.imagen.alt"
          :ratio="16 / 9"
          sizes="(min-width: 768px) 480px, 92vw"
          class="rounded-t-[1.2rem]"
        />
        <div class="flex flex-1 flex-col p-6 sm:p-8">
          <p class="eyebrow">
            {{ lugar.titulo }}
          </p>
          <h3 class="mt-2 font-display text-[1.75rem] font-medium leading-tight text-ink">
            {{ lugar.nombre }}
          </h3>

          <dl class="mt-5 space-y-3 text-[0.975rem]">
            <div class="flex gap-3">
              <dt class="sr-only">
                Fecha
              </dt>
              <Icon name="lucide:calendar-heart" class="mt-0.5 size-5 shrink-0 text-accent-ink" />
              <dd>{{ capitalize(formatLongDate(lugar.inicio)) }}</dd>
            </div>
            <div class="flex gap-3">
              <dt class="sr-only">
                Hora
              </dt>
              <Icon name="lucide:clock" class="mt-0.5 size-5 shrink-0 text-accent-ink" />
              <dd>{{ formatTime(lugar.inicio) }}</dd>
            </div>
            <div class="flex gap-3">
              <dt class="sr-only">
                Dirección
              </dt>
              <Icon name="lucide:map-pin" class="mt-0.5 size-5 shrink-0 text-accent-ink" />
              <dd class="text-muted">
                {{ lugar.direccion }}
              </dd>
            </div>
          </dl>

          <p v-if="lugar.nota" class="mt-4 flex gap-2 rounded-xl bg-surface-alt px-4 py-3 text-sm text-muted">
            <Icon name="lucide:info" class="mt-0.5 size-4 shrink-0 text-accent-ink" />
            {{ lugar.nota }}
          </p>

          <div class="mt-auto grid gap-2.5 pt-6 sm:grid-cols-[1fr_auto]">
            <a :href="googleMapsUrl(lugar)" target="_blank" rel="noopener" class="btn btn-primary btn-sm">
              <Icon name="lucide:navigation" class="size-4" />
              Cómo llegar
            </a>
            <a :href="wazeUrl(lugar)" target="_blank" rel="noopener" class="btn btn-outline btn-sm" :aria-label="`Abrir ${lugar.nombre} en Waze`">
              Waze
            </a>
            <InvitationCalendarMenu :lugar="lugar" class="sm:col-span-2" />
          </div>
        </div>
      </article>
    </div>
  </InvitationSection>
</template>
