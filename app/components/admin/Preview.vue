<script setup lang="ts">
import { events } from '~/events'

/** Vista previa de cada invitación en un marco de teléfono (375 × 760). */
</script>

<template>
  <div class="grid justify-items-center gap-8 md:grid-cols-2">
    <figure v-for="e in events" :key="e.slug" class="w-full max-w-[400px]">
      <figcaption class="mb-3 flex items-center justify-between gap-2">
        <span class="font-medium">{{ eventKind(e) }} · {{ e.titulo }}</span>
        <a :href="`/${e.slug}`" target="_blank" rel="noopener" class="btn btn-outline btn-sm">
          <Icon name="lucide:external-link" class="size-4" /> Abrir
        </a>
      </figcaption>
      <div class="mx-auto w-fit rounded-[2.6rem] bg-[#1C1917] p-3 shadow-2xl">
        <div class="relative h-[min(760px,75svh)] w-[min(375px,calc(100vw-4rem))] overflow-hidden rounded-[2rem] bg-white">
          <iframe
            :src="`/${e.slug}`"
            :title="`Vista previa: ${e.titulo}`"
            loading="lazy"
            class="size-full border-0"
          />
        </div>
      </div>
    </figure>
  </div>
</template>
