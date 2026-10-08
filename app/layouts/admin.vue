<script setup lang="ts">
/** Layout neutro del panel (independiente de los temas de las invitaciones). */
useHead({
  meta: [{ name: 'robots', content: 'noindex' }],
  bodyAttrs: { style: 'background:#F5F5F4' },
})
</script>

<template>
  <div class="admin min-h-svh font-sans text-[#1C1917]">
    <slot />
  </div>
</template>

<style>
.admin {
  --c-fondo: #F5F5F4;
  --c-superficie: #FFFFFF;
  --c-superficie-alt: #F0EFED;
  --c-tinta: #1C1917;
  --c-tenue: #57534E;
  --c-primario: #1C1917;
  --c-sobre-primario: #FAFAF9;
  --c-acento: #B8975A;
  --c-acento-tinta: #7D612B;
  --c-linea: #E7E5E4;
  background: var(--c-fondo);
  font-size: 0.9375rem;
  line-height: 1.5;
}
.admin .btn {
  font-family: var(--font-sans);
  border-radius: 10px;
  min-height: 40px;
  padding: 0.5rem 0.9rem;
  font-size: 0.875rem;
  letter-spacing: 0;
}
.admin .btn-sm {
  min-height: 36px;
  padding: 0.4rem 0.75rem;
  font-size: 0.8125rem;
}
.admin .field {
  min-height: 42px;
  border-radius: 10px;
  padding: 0.55rem 0.8rem;
  font-size: 0.9375rem;
  background: #fff;
}
.admin .field-label {
  font-size: 0.8125rem;
}
.admin .panel {
  background: #fff;
  border: 1px solid var(--c-linea);
  border-radius: 14px;
}
@media (pointer: coarse) {
  .admin .btn,
  .admin .btn-sm,
  .admin .field {
    min-height: 44px;
  }
}
</style>
