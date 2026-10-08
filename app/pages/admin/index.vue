<script setup lang="ts">
import { toast } from 'vue-sonner'
import { events } from '~/events'

definePageMeta({ layout: 'admin', middleware: 'admin' })
useHead({ title: 'Panel de invitaciones · Demo' })

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const { resetDemo, loadSamples } = useDemo()

type Tab = 'confirmaciones' | 'generador' | 'vista-previa'
const TABS: { id: Tab, label: string, icon: string }[] = [
  { id: 'confirmaciones', label: 'Confirmaciones', icon: 'lucide:user-check' },
  { id: 'generador', label: 'Generador de enlaces', icon: 'lucide:link' },
  { id: 'vista-previa', label: 'Vista previa', icon: 'lucide:smartphone' },
]

const tab = computed<Tab>({
  get: () => (TABS.some(t => t.id === route.query.tab) ? route.query.tab as Tab : 'confirmaciones'),
  set: v => router.replace({ query: { ...route.query, tab: v } }),
})
const evento = computed<string>({
  get: () => (typeof route.query.evento === 'string' && events.some(e => e.slug === route.query.evento) ? route.query.evento : 'todos'),
  set: v => router.replace({ query: { ...route.query, evento: v === 'todos' ? undefined : v } }),
})

const { rows, kpis } = useAdminRows(evento)

function samples() {
  const n = loadSamples()
  toast.success('Datos de ejemplo cargados', { description: `${n} confirmaciones y lista de invitados ficticios.` })
}

const confirmReset = ref(false)
function reset() {
  if (!confirmReset.value) {
    confirmReset.value = true
    setTimeout(() => (confirmReset.value = false), 4000)
    return
  }
  confirmReset.value = false
  resetDemo()
  toast.success('Demo restablecida', { description: 'Se borraron confirmaciones, invitados y preferencias.' })
}

async function logout() {
  auth.logout()
  await navigateTo('/admin/login')
}

// Navegación por teclado entre pestañas (patrón ARIA tabs).
function onTabKey(e: KeyboardEvent, i: number) {
  const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
  if (!dir) return
  const next = TABS[(i + dir + TABS.length) % TABS.length]!
  tab.value = next.id
  nextTick(() => document.getElementById(`tab-${next.id}`)?.focus())
}
</script>

<template>
  <div>
    <header class="sticky top-0 z-30 border-b border-[#E7E5E4] bg-white/85 backdrop-blur">
      <div class="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <NuxtLink to="/" class="flex items-center gap-2.5" aria-label="Ir a los demos">
          <span class="grid size-9 place-items-center rounded-lg bg-[#1C1917] text-white"><Icon name="lucide:mail" class="size-4" /></span>
          <span class="hidden leading-tight sm:block">
            <span class="block text-sm font-semibold">Invitaciones</span>
            <span class="block text-xs text-[#57534E]">Panel demo</span>
          </span>
        </NuxtLink>
        <span class="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-900">Entorno de demostración</span>
        <div class="ml-auto flex items-center gap-1">
          <button type="button" class="btn btn-ghost btn-sm" @click="logout">
            <Icon name="lucide:log-out" class="size-4" /><span class="hidden sm:inline">Salir</span>
          </button>
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-6xl px-4 pb-16 pt-6">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 class="text-2xl font-semibold tracking-tight">
            Invitados y confirmaciones
          </h1>
          <p class="text-sm text-[#57534E]">
            Las confirmaciones de las invitaciones abiertas en este navegador aparecen aquí en tiempo real.
          </p>
        </div>
        <div class="flex flex-wrap gap-2">
          <label class="sr-only" for="evento">Evento</label>
          <select id="evento" v-model="evento" class="field !w-auto">
            <option value="todos">
              Todos los eventos
            </option>
            <option v-for="e in events" :key="e.slug" :value="e.slug">
              {{ eventKind(e) }} · {{ e.titulo }}
            </option>
          </select>
          <button type="button" class="btn btn-outline btn-sm" @click="samples">
            <Icon name="lucide:database" class="size-4" /> Cargar confirmaciones de ejemplo
          </button>
          <button type="button" class="btn btn-sm" :class="confirmReset ? 'bg-rose-700 text-white' : 'btn-outline'" @click="reset">
            <Icon name="lucide:rotate-ccw" class="size-4" /> {{ confirmReset ? '¿Seguro? Toca de nuevo' : 'Restablecer demo' }}
          </button>
        </div>
      </div>

      <div class="mt-6">
        <div role="tablist" aria-label="Secciones del panel" class="scrollbar-none flex gap-1 overflow-x-auto rounded-xl bg-[#E7E5E4]/70 p-1">
          <button
            v-for="(t, i) in TABS"
            :id="`tab-${t.id}`"
            :key="t.id"
            type="button"
            role="tab"
            :aria-selected="tab === t.id"
            :aria-controls="`panel-${t.id}`"
            :tabindex="tab === t.id ? 0 : -1"
            class="inline-flex min-h-10 shrink-0 flex-1 items-center justify-center gap-2 rounded-lg px-3 text-sm font-medium transition"
            :class="tab === t.id ? 'bg-white shadow-sm' : 'text-[#57534E] hover:text-[#1C1917]'"
            @click="tab = t.id"
            @keydown="onTabKey($event, i)"
          >
            <Icon :name="t.icon" class="size-4" /> {{ t.label }}
          </button>
        </div>
      </div>

      <div v-if="tab === 'confirmaciones'" id="panel-confirmaciones" role="tabpanel" aria-labelledby="tab-confirmaciones" class="mt-6 space-y-5">
        <AdminKpis :kpis="kpis" />
        <AdminResponses :rows="rows" :evento="evento">
          <template #empty>
            <button type="button" class="btn btn-primary btn-sm mt-5" @click="samples">
              <Icon name="lucide:database" class="size-4" /> Cargar confirmaciones de ejemplo
            </button>
          </template>
        </AdminResponses>
      </div>

      <div v-else-if="tab === 'generador'" id="panel-generador" role="tabpanel" aria-labelledby="tab-generador" class="mt-6">
        <AdminGenerator :evento="evento" />
      </div>

      <div v-else id="panel-vista-previa" role="tabpanel" aria-labelledby="tab-vista-previa" class="mt-8">
        <AdminPreview />
      </div>
    </main>
  </div>
</template>
