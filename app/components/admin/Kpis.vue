<script setup lang="ts">
defineProps<{
  kpis: { invitados: number, confirmados: number, noAsisten: number, pendientes: number, personas: number, pasesAsignados: number }
}>()
</script>

<template>
  <dl class="grid grid-cols-2 gap-3 lg:grid-cols-5">
    <div class="panel p-4">
      <dt class="flex items-center gap-2 text-xs font-medium text-[#57534E]">
        <Icon name="lucide:users" class="size-4" /> Invitados
      </dt>
      <dd class="mt-2 text-2xl font-semibold tabular-nums">
        {{ kpis.invitados }}
      </dd>
    </div>
    <div class="panel p-4">
      <dt class="flex items-center gap-2 text-xs font-medium text-[#57534E]">
        <Icon name="lucide:user-check" class="size-4 text-emerald-700" /> Confirmados
      </dt>
      <dd class="mt-2 text-2xl font-semibold tabular-nums">
        {{ kpis.confirmados }}
      </dd>
    </div>
    <div class="panel p-4">
      <dt class="flex items-center gap-2 text-xs font-medium text-[#57534E]">
        <Icon name="lucide:user-x" class="size-4 text-rose-700" /> No asisten
      </dt>
      <dd class="mt-2 text-2xl font-semibold tabular-nums">
        {{ kpis.noAsisten }}
      </dd>
    </div>
    <div class="panel p-4">
      <dt class="flex items-center gap-2 text-xs font-medium text-[#57534E]">
        <Icon name="lucide:hourglass" class="size-4 text-amber-700" /> Pendientes
      </dt>
      <dd class="mt-2 text-2xl font-semibold tabular-nums">
        {{ kpis.pendientes }}
      </dd>
    </div>
    <div class="col-span-2 rounded-[14px] bg-[#1C1917] p-4 text-white lg:col-span-1">
      <dt class="flex items-center gap-2 text-xs font-medium text-white/70">
        <Icon name="lucide:heart" class="size-4 text-[#E8D4A6]" /> Personas confirmadas
      </dt>
      <dd class="mt-2 flex items-baseline gap-2">
        <span class="text-2xl font-semibold tabular-nums">{{ kpis.personas }}</span>
        <span class="text-xs text-white/60">de {{ kpis.pasesAsignados }} pases</span>
      </dd>
    </div>
  </dl>
</template>
