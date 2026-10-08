<script setup lang="ts">
/** Código de vestimenta con paleta sugerida y colores reservados. */
const { config } = useInvitation()
const v = config.vestimenta!
</script>

<template>
  <InvitationSection id="vestimenta" alt eyebrow="Código de vestimenta" :title="v.codigo" narrow>
    <div class="text-center">
      <p v-reveal class="mx-auto max-w-md text-balance font-display text-xl italic text-muted">
        {{ v.descripcion }}
      </p>
      <ul class="mx-auto mt-8 max-w-md space-y-2 text-left">
        <li v-for="(nota, i) in v.notas" :key="nota" v-reveal="i * 70" class="flex gap-3">
          <Icon name="lucide:sparkle" class="mt-1.5 size-3.5 shrink-0 text-accent-ink" />
          <span>{{ nota }}</span>
        </li>
      </ul>

      <div v-reveal class="mt-12">
        <p class="eyebrow">
          Colores sugeridos
        </p>
        <ul class="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-4">
          <li v-for="color in v.sugeridos" :key="color.hex" class="flex w-16 flex-col items-center gap-2">
            <span class="size-12 rounded-full border border-line shadow-inner ring-4 ring-surface" :style="{ background: color.hex }" />
            <span class="text-xs leading-tight text-muted">{{ color.nombre }}</span>
          </li>
        </ul>
      </div>

      <div v-if="v.reservados?.length" v-reveal class="card mx-auto mt-10 max-w-md px-6 py-6">
        <p class="eyebrow">
          Colores reservados
        </p>
        <ul class="mt-4 space-y-3">
          <li v-for="color in v.reservados" :key="color.hex" class="flex items-center gap-4 text-left">
            <span class="relative size-10 shrink-0 overflow-hidden rounded-full border border-line" :style="{ background: color.hex }" aria-hidden="true">
              <span class="absolute left-1/2 top-[-20%] h-[140%] w-px -translate-x-1/2 rotate-45 bg-[#B4413A]" />
            </span>
            <span>
              <span class="block font-medium text-ink">{{ color.nombre }}</span>
              <span class="block text-sm text-muted">{{ color.motivo }}</span>
            </span>
          </li>
        </ul>
      </div>
    </div>
  </InvitationSection>
</template>
