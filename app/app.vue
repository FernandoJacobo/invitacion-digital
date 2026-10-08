<script setup lang="ts">
import { Toaster } from 'vue-sonner'
import 'vue-sonner/style.css'

const route = useRoute()
const isAdmin = computed(() => route.path.startsWith('/admin'))

// El HTML estático de cada invitación trae su color de fondo para el primer pintado; ya montada la app, el tema manda.
onMounted(() => document.getElementById('boot-bg')?.remove())
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <Toaster
    :position="isAdmin ? 'bottom-right' : 'top-center'"
    :toast-options="{ class: isAdmin ? 'toast-admin' : 'toast-inv', duration: 3200 }"
    :offset="16"
    :mobile-offset="16"
  />
</template>

<style>
[data-sonner-toaster] {
  --border-radius: 14px;
}
[data-sonner-toast].toast-inv {
  background: var(--c-superficie);
  color: var(--c-tinta);
  border: 1px solid var(--c-linea);
  font-family: var(--font-body);
  font-size: 0.9375rem;
  box-shadow: 0 18px 40px -18px rgb(0 0 0 / 0.35);
}
[data-sonner-toast].toast-inv [data-description] {
  color: var(--c-tenue);
}
[data-sonner-toast].toast-inv [data-icon] {
  color: var(--c-acento-tinta);
}
[data-sonner-toast].toast-admin {
  font-family: var(--font-sans);
  font-size: 0.875rem;
  border-radius: 12px;
}
</style>
