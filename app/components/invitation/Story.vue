<script setup lang="ts">
/** Línea del tiempo de la pareja (boda). Cada hito aparece al hacer scroll. */
const { config } = useInvitation()
const historia = config.historia!
// En escritorio los hitos alternan lados; la animación entra desde ese lado.
const sides = historia.hitos.map((_, i) => (i % 2 === 0 ? 'left' : 'right'))
</script>

<template>
  <InvitationSection id="historia" eyebrow="Cómo empezó todo" :title="historia.titulo">
    <p v-if="historia.intro" v-reveal class="mx-auto -mt-4 mb-14 max-w-lg text-balance text-center font-display text-xl italic text-muted">
      {{ historia.intro }}
    </p>

    <ol class="relative mx-auto max-w-3xl">
      <!-- Línea vertical -->
      <span class="absolute bottom-2 left-[11px] top-2 w-px bg-gradient-to-b from-transparent via-accent to-transparent md:left-1/2" aria-hidden="true" />

      <li
        v-for="(hito, i) in historia.hitos"
        :key="hito.titulo"
        class="relative grid gap-4 pb-14 pl-10 last:pb-0 md:grid-cols-2 md:gap-14 md:pl-0"
      >
        <span class="absolute left-0 top-1.5 grid size-6 place-items-center rounded-full border border-accent bg-bg md:left-1/2 md:-translate-x-1/2" aria-hidden="true">
          <span class="size-2 rounded-full bg-accent" />
        </span>

        <div
          v-reveal:[sides[i]]
          class="md:text-right"
          :class="i % 2 === 1 ? 'md:col-start-2 md:row-start-1 md:text-left' : ''"
        >
          <p class="eyebrow">
            {{ hito.fecha }}
          </p>
          <h3 class="mt-2 font-display text-3xl font-medium text-ink">
            {{ hito.titulo }}
          </h3>
          <p class="mt-2 text-muted">
            {{ hito.texto }}
          </p>
        </div>

        <div v-if="hito.imagen" v-reveal:zoom="150" :class="i % 2 === 1 ? 'md:col-start-1 md:row-start-1' : ''">
          <UiSmartImage
            :src="hito.imagen.src"
            :alt="hito.imagen.alt"
            :ratio="3 / 2"
            sizes="(min-width: 768px) 420px, 90vw"
            class="rounded-2xl"
          />
        </div>
      </li>
    </ol>
  </InvitationSection>
</template>
