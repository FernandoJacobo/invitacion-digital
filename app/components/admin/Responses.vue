<script setup lang="ts">
import { toast } from 'vue-sonner'
import type { AdminRow, RowStatus } from '~/composables/useAdminRows'
import { getEvent } from '~/events'
import { toCSV } from '~/utils/csv'
import { downloadCSV } from '~/utils/browser'
import { normalizeName, buildGuestUrl } from '~/utils/guest'
import { buildInvitationMessage, whatsappUrl } from '~/utils/whatsapp'

/** Tabla de confirmaciones con filtros, búsqueda y exportación a CSV. */
const props = defineProps<{ rows: AdminRow[], evento: string }>()
const rsvp = useRsvpStore()
const guests = useGuestsStore()

const query = ref('')
const status = ref<'todos' | RowStatus>('todos')

const STATUS: Record<RowStatus, { label: string, cls: string }> = {
  si: { label: 'Asiste', cls: 'bg-emerald-50 text-emerald-800 ring-emerald-200' },
  no: { label: 'No asiste', cls: 'bg-rose-50 text-rose-800 ring-rose-200' },
  pendiente: { label: 'Pendiente', cls: 'bg-amber-50 text-amber-900 ring-amber-200' },
}

const filtered = computed(() => {
  const q = normalizeName(query.value)
  return props.rows.filter((r) => {
    if (status.value !== 'todos' && r.estado !== status.value) return false
    if (!q) return true
    return normalizeName(`${r.nombre} ${r.restricciones} ${r.mensaje}`).includes(q)
  })
})

const counts = computed(() => ({
  todos: props.rows.length,
  si: props.rows.filter(r => r.estado === 'si').length,
  no: props.rows.filter(r => r.estado === 'no').length,
  pendiente: props.rows.filter(r => r.estado === 'pendiente').length,
}))

const eventLabel = (slug: string) => {
  const e = getEvent(slug)
  return e ? eventKind(e) : slug
}

function exportCSV() {
  const csv = toCSV(
    ['Evento', 'Nombre', 'Estado', 'Personas', 'Pases asignados', 'Restricciones', 'Mensaje', 'Fecha de respuesta'],
    filtered.value.map(r => [
      eventLabel(r.evento),
      r.nombre,
      STATUS[r.estado].label,
      r.pases,
      r.pasesAsignados,
      r.restricciones,
      r.mensaje,
      r.fecha ? formatTimestamp(r.fecha) : '',
    ]),
  )
  downloadCSV(`confirmaciones-${props.evento}-${new Date().toISOString().slice(0, 10)}`, csv)
  toast.success('CSV exportado', { description: `${filtered.value.length} registros` })
}

function reminderUrl(r: AdminRow) {
  const e = getEvent(r.evento)
  if (!e) return '#'
  const url = buildGuestUrl(window.location.origin, e.slug, { invitado: r.nombre, pases: r.pasesAsignados })
  return whatsappUrl(null, `${buildInvitationMessage(e, { invitado: r.nombre, pases: r.pasesAsignados }, url)}\n\n(Recordatorio amable 💛)`)
}

function remove(r: AdminRow) {
  if (r.responseId) rsvp.remove(r.responseId)
  if (r.guestId) guests.remove(r.guestId)
  toast('Registro eliminado', { description: r.nombre })
}
</script>

<template>
  <section class="panel overflow-hidden" aria-labelledby="resp-title">
    <div class="flex flex-col gap-3 border-b border-[#E7E5E4] p-4 sm:flex-row sm:items-center sm:justify-between">
      <h2 id="resp-title" class="font-semibold">
        Confirmaciones
      </h2>
      <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
        <label class="relative">
          <span class="sr-only">Buscar</span>
          <Icon name="lucide:search" class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#A8A29E]" />
          <input v-model="query" type="search" class="field !pl-9 sm:w-64" placeholder="Buscar nombre, mensaje…">
        </label>
        <button type="button" class="btn btn-outline btn-sm" :disabled="!filtered.length" @click="exportCSV">
          <Icon name="lucide:download" class="size-4" /> Exportar CSV
        </button>
      </div>
    </div>

    <div class="flex gap-1.5 overflow-x-auto border-b border-[#E7E5E4] px-4 py-2.5" role="group" aria-label="Filtrar por estado">
      <button
        v-for="opt in (['todos', 'si', 'no', 'pendiente'] as const)"
        :key="opt"
        type="button"
        class="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-full px-3 text-sm transition"
        :class="status === opt ? 'bg-[#1C1917] text-white' : 'text-[#57534E] hover:bg-[#F0EFED]'"
        :aria-pressed="status === opt"
        @click="status = opt"
      >
        {{ opt === 'todos' ? 'Todos' : STATUS[opt].label }}
        <span class="tabular-nums opacity-70">{{ counts[opt] }}</span>
      </button>
    </div>

    <!-- Vacío -->
    <div v-if="!rows.length" class="flex flex-col items-center px-6 py-16 text-center">
      <span class="grid size-12 place-items-center rounded-full bg-[#F0EFED] text-[#57534E]"><Icon name="lucide:mail" class="size-5" /></span>
      <p class="mt-4 font-medium">
        Aún no hay confirmaciones
      </p>
      <p class="mt-1 max-w-sm text-sm text-[#57534E]">
        Confirma desde una invitación en otra pestaña (aparecerá aquí al instante) o carga los datos de ejemplo.
      </p>
      <slot name="empty" />
    </div>
    <p v-else-if="!filtered.length" class="px-6 py-12 text-center text-sm text-[#57534E]">
      Sin resultados para ese filtro.
    </p>

    <!-- Escritorio: tabla -->
    <div v-if="filtered.length" class="hidden overflow-x-auto md:block">
      <table class="w-full text-left text-sm">
        <thead class="bg-[#FAFAF9] text-xs text-[#57534E]">
          <tr>
            <th scope="col" class="px-4 py-2.5 font-medium">
              Nombre
            </th>
            <th v-if="evento === 'todos'" scope="col" class="px-4 py-2.5 font-medium">
              Evento
            </th>
            <th scope="col" class="px-4 py-2.5 font-medium">
              Estado
            </th>
            <th scope="col" class="px-4 py-2.5 text-right font-medium">
              Pases
            </th>
            <th scope="col" class="px-4 py-2.5 font-medium">
              Restricciones
            </th>
            <th scope="col" class="px-4 py-2.5 font-medium">
              Mensaje
            </th>
            <th scope="col" class="px-4 py-2.5 font-medium">
              Fecha
            </th>
            <th scope="col" class="px-2 py-2.5">
              <span class="sr-only">Acciones</span>
            </th>
          </tr>
        </thead>
        <TransitionGroup tag="tbody" name="row" class="divide-y divide-[#F0EFED]">
          <tr v-for="r in filtered" :key="r.key" class="align-top hover:bg-[#FAFAF9]">
            <td class="px-4 py-3 font-medium">
              {{ r.nombre }}
            </td>
            <td v-if="evento === 'todos'" class="whitespace-nowrap px-4 py-3 text-[#57534E]">
              {{ eventLabel(r.evento) }}
            </td>
            <td class="px-4 py-3">
              <span class="inline-flex rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset" :class="STATUS[r.estado].cls">{{ STATUS[r.estado].label }}</span>
            </td>
            <td class="whitespace-nowrap px-4 py-3 text-right tabular-nums">
              {{ r.estado === 'si' ? r.pases : '—' }}<span class="text-[#A8A29E]"> / {{ r.pasesAsignados }}</span>
            </td>
            <td class="max-w-[10rem] px-4 py-3 text-[#57534E]">
              {{ r.restricciones || '—' }}
            </td>
            <td class="max-w-[16rem] px-4 py-3 text-[#57534E]">
              <span class="line-clamp-2" :title="r.mensaje">{{ r.mensaje || '—' }}</span>
            </td>
            <td class="whitespace-nowrap px-4 py-3 text-[#57534E]">
              {{ r.fecha ? formatTimestamp(r.fecha) : '—' }}
            </td>
            <td class="whitespace-nowrap px-2 py-2 text-right">
              <a
                v-if="r.estado === 'pendiente'"
                :href="reminderUrl(r)"
                target="_blank"
                rel="noopener"
                class="inline-grid size-9 place-items-center rounded-lg text-[#57534E] hover:bg-[#F0EFED]"
                :aria-label="`Enviar recordatorio a ${r.nombre}`"
                title="Enviar recordatorio por WhatsApp"
              ><UiWhatsappIcon class="size-4" /></a>
              <button type="button" class="inline-grid size-9 place-items-center rounded-lg text-[#57534E] hover:bg-[#F0EFED] hover:text-rose-700" :aria-label="`Eliminar ${r.nombre}`" title="Eliminar" @click="remove(r)">
                <Icon name="lucide:trash" class="size-4" />
              </button>
            </td>
          </tr>
        </TransitionGroup>
      </table>
    </div>

    <!-- Móvil: tarjetas -->
    <TransitionGroup v-if="filtered.length" tag="ul" name="row" class="divide-y divide-[#F0EFED] md:hidden">
      <li v-for="r in filtered" :key="r.key" class="p-4">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="font-medium">
              {{ r.nombre }}
            </p>
            <p class="text-xs text-[#57534E]">
              <template v-if="evento === 'todos'">
                {{ eventLabel(r.evento) }} ·
              </template>
              {{ r.fecha ? formatTimestamp(r.fecha) : 'Sin respuesta' }}
            </p>
          </div>
          <span class="inline-flex shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset" :class="STATUS[r.estado].cls">
            {{ STATUS[r.estado].label }}{{ r.estado === 'si' ? ` · ${r.pases}` : '' }}
          </span>
        </div>
        <p v-if="r.restricciones" class="mt-2 text-sm text-[#57534E]">
          <span class="font-medium text-[#1C1917]">Restricciones:</span> {{ r.restricciones }}
        </p>
        <p v-if="r.mensaje" class="mt-1 text-sm italic text-[#57534E]">
          “{{ r.mensaje }}”
        </p>
        <div class="mt-2 flex gap-1">
          <a v-if="r.estado === 'pendiente'" :href="reminderUrl(r)" target="_blank" rel="noopener" class="btn btn-ghost btn-sm">
            <UiWhatsappIcon class="size-4" /> Recordar
          </a>
          <button type="button" class="btn btn-ghost btn-sm text-rose-700" @click="remove(r)">
            <Icon name="lucide:trash" class="size-4" /> Eliminar
          </button>
        </div>
      </li>
    </TransitionGroup>
  </section>
</template>

<style scoped>
.row-enter-active {
  transition: background-color 1.6s ease, opacity 0.4s;
}
.row-enter-from {
  background-color: #FEF3C7;
  opacity: 0;
}
</style>
