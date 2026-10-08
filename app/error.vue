<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
const notFound = computed(() => props.error.statusCode === 404)

useHead({ title: notFound.value ? 'Invitación no encontrada' : 'Algo salió mal' })
</script>

<template>
  <main class="grid min-h-svh place-items-center bg-bg px-6 text-center text-ink">
    <div class="max-w-sm">
      <OrnamentsDivider kind="botanico" class="mx-auto mb-6 w-40 text-accent" />
      <p class="eyebrow">{{ notFound ? 'Error 404' : 'Error' }}</p>
      <h1 class="mt-3 font-display text-4xl font-medium">
        {{ notFound ? 'No encontramos esta invitación' : 'Algo salió mal' }}
      </h1>
      <p class="mt-4 text-muted">
        {{ notFound ? 'Revisa que el enlace esté completo o vuelve al inicio para ver los demos.' : 'Intenta recargar la página en unos segundos.' }}
      </p>
      <button type="button" class="btn btn-primary mt-8" @click="clearError({ redirect: '/' })">
        Volver al inicio
      </button>
    </div>
  </main>
</template>
