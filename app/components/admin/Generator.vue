<script setup lang="ts">
import { toast } from 'vue-sonner'
import { events, getEvent } from '~/events'
import { buildGuestUrl, pasesLabel, sanitizeGuestName } from '~/utils/guest'
import { buildInvitationMessage, whatsappUrl } from '~/utils/whatsapp'
import { parseGuestList, toCSV } from '~/utils/csv'
import type { GuestListResult } from '~/utils/csv'
import { copyText, downloadCSV } from '~/utils/browser'

/** Generador de enlaces personalizados: individual, carga masiva (texto/CSV) y lista de invitados. */
const props = defineProps<{ evento: string }>()
const guests = useGuestsStore()

const slug = ref(props.evento === 'todos' ? events[0]!.slug : props.evento)
watch(() => props.evento, (v) => {
  if (v !== 'todos') slug.value = v
})
const config = computed(() => getEvent(slug.value)!)
const origin = typeof window !== 'undefined' ? window.location.origin : ''

// ── Individual ──
const nombre = ref('')
const pases = ref(2)
const cleanName = computed(() => sanitizeGuestName(nombre.value))
const pasesOk = computed(() => Number.isInteger(pases.value) && pases.value >= 1 && pases.value <= config.value.rsvp.maxPases)
const link = computed(() => buildGuestUrl(origin, slug.value, { invitado: cleanName.value, pases: pasesOk.value ? pases.value : null }))
const inviteText = computed(() => buildInvitationMessage(config.value, { invitado: cleanName.value, pases: pases.value }, link.value))

async function copy(text: string, what = 'Enlace copiado') {
  if (await copyText(text)) toast.success(what)
  else toast.error('No se pudo copiar')
}

function saveSingle() {
  if (!cleanName.value || !pasesOk.value) return
  const added = guests.add(slug.value, [{ nombre: cleanName.value, pases: pases.value }])
  toast.success(added ? 'Invitado agregado a la lista' : 'Invitado actualizado', { description: `${cleanName.value} · ${pasesLabel(pases.value)}` })
  nombre.value = ''
}

// ── Masivo ──
const bulkText = ref('')
const bulkResult = ref<GuestListResult | null>(null)
const fileInput = ref<HTMLInputElement>()

function parseBulk() {
  bulkResult.value = parseGuestList(bulkText.value, { pasesPorDefecto: config.value.rsvp.pasesPorDefecto, maxPases: config.value.rsvp.maxPases })
  if (!bulkResult.value.guests.length) toast.error('No se encontraron invitados', { description: 'Usa una línea por invitado: Nombre, pases' })
}

async function onFile(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  bulkText.value = await file.text()
  parseBulk()
  ;(e.target as HTMLInputElement).value = ''
}

function addBulk() {
  if (!bulkResult.value?.guests.length) return
  const total = bulkResult.value.guests.length
  const added = guests.add(slug.value, bulkResult.value.guests)
  toast.success(`${total} enlaces generados`, { description: added < total ? `${added} nuevos, ${total - added} actualizados` : undefined })
  bulkText.value = ''
  bulkResult.value = null
}

const EXAMPLE = 'Familia Pérez, 4\nAna y Luis Gómez, 2\nTía Carmen, 1\n"Rodríguez, Familia", 5'

// ── Lista ──
const list = computed(() => guests.guests.filter(g => g.evento === slug.value))
const guestUrl = (g: { nombre: string, pases: number }) => buildGuestUrl(origin, slug.value, { invitado: g.nombre, pases: g.pases })
const guestWa = (g: { nombre: string, pases: number }) => whatsappUrl(null, buildInvitationMessage(config.value, { invitado: g.nombre, pases: g.pases }, guestUrl(g)))

function exportList() {
  const csv = toCSV(['Nombre', 'Pases', 'Evento', 'Enlace'], list.value.map(g => [g.nombre, g.pases, eventKind(config.value), guestUrl(g)]))
  downloadCSV(`enlaces-${slug.value}`, csv)
  toast.success('CSV exportado', { description: `${list.value.length} enlaces` })
}
</script>

<template>
  <div class="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
    <!-- Individual -->
    <section class="panel p-5" aria-labelledby="gen-title">
      <h2 id="gen-title" class="font-semibold">
        Enlace personalizado
      </h2>
      <p class="mt-1 text-sm text-[#57534E]">
        El invitado verá su nombre en el sobre y el RSVP se limitará a sus pases.
      </p>

      <div class="mt-5 grid gap-4 sm:grid-cols-[1fr_7rem]">
        <div class="sm:col-span-2">
          <label for="gen-evento" class="field-label">Evento</label>
          <select id="gen-evento" v-model="slug" class="field">
            <option v-for="e in events" :key="e.slug" :value="e.slug">
              {{ eventKind(e) }} · {{ e.titulo }}
            </option>
          </select>
        </div>
        <div>
          <label for="gen-nombre" class="field-label">Nombre del invitado</label>
          <input id="gen-nombre" v-model="nombre" class="field" placeholder="Ej. Familia Pérez" maxlength="60" @keydown.enter.prevent="saveSingle">
        </div>
        <div>
          <label for="gen-pases" class="field-label">Pases</label>
          <input id="gen-pases" v-model.number="pases" type="number" min="1" :max="config.rsvp.maxPases" class="field" :aria-invalid="!pasesOk">
        </div>
      </div>
      <p v-if="!pasesOk" class="mt-2 text-sm text-red-700">
        Entre 1 y {{ config.rsvp.maxPases }} pases.
      </p>

      <div class="mt-4 rounded-xl border border-dashed border-[#D6D3D1] bg-[#FAFAF9] p-3">
        <p class="text-xs font-medium text-[#57534E]">
          Enlace generado
        </p>
        <p class="mt-1 break-all font-mono text-[0.8rem] leading-relaxed">
          {{ link }}
        </p>
      </div>

      <div class="mt-4 flex flex-wrap gap-2">
        <button type="button" class="btn btn-primary btn-sm" @click="copy(link)">
          <Icon name="lucide:copy" class="size-4" /> Copiar enlace
        </button>
        <a :href="whatsappUrl(null, inviteText)" target="_blank" rel="noopener" class="btn btn-outline btn-sm">
          <UiWhatsappIcon class="size-4 text-[#1A7F45]" /> Enviar por WhatsApp
        </a>
        <a :href="link" target="_blank" rel="noopener" class="btn btn-ghost btn-sm">
          <Icon name="lucide:external-link" class="size-4" /> Abrir
        </a>
        <button type="button" class="btn btn-ghost btn-sm" :disabled="!cleanName || !pasesOk" @click="saveSingle">
          <Icon name="lucide:plus" class="size-4" /> Guardar en la lista
        </button>
      </div>
    </section>

    <!-- Masivo -->
    <section class="panel p-5" aria-labelledby="bulk-title">
      <h2 id="bulk-title" class="font-semibold">
        Carga masiva
      </h2>
      <p class="mt-1 text-sm text-[#57534E]">
        Pega tu lista (una línea por invitado: <code>Nombre, pases</code>) o sube un CSV. También acepta columnas copiadas de Excel o Google Sheets.
      </p>
      <label for="bulk" class="sr-only">Lista de invitados</label>
      <textarea id="bulk" v-model="bulkText" rows="6" class="field mt-4 font-mono !text-[0.85rem]" :placeholder="EXAMPLE" />
      <div class="mt-3 flex flex-wrap gap-2">
        <button type="button" class="btn btn-primary btn-sm" :disabled="!bulkText.trim()" @click="parseBulk">
          <Icon name="lucide:list" class="size-4" /> Revisar lista
        </button>
        <button type="button" class="btn btn-outline btn-sm" @click="fileInput?.click()">
          <Icon name="lucide:upload" class="size-4" /> Subir CSV
        </button>
        <button type="button" class="btn btn-ghost btn-sm" @click="bulkText = EXAMPLE">
          Usar ejemplo
        </button>
        <input ref="fileInput" type="file" accept=".csv,.txt,text/csv,text/plain" class="hidden" @change="onFile">
      </div>

      <div v-if="bulkResult" class="mt-4 rounded-xl border border-[#E7E5E4]">
        <div class="flex items-center justify-between gap-2 border-b border-[#E7E5E4] px-3 py-2">
          <p class="text-sm font-medium">
            {{ bulkResult.guests.length }} invitados · {{ bulkResult.guests.reduce((s, g) => s + g.pases, 0) }} pases
          </p>
          <button type="button" class="btn btn-primary btn-sm" :disabled="!bulkResult.guests.length" @click="addBulk">
            Generar {{ bulkResult.guests.length }} enlaces
          </button>
        </div>
        <ul v-if="bulkResult.warnings.length" class="space-y-1 border-b border-[#E7E5E4] bg-amber-50 px-3 py-2 text-xs text-amber-900">
          <li v-for="w in bulkResult.warnings" :key="w.line + w.message">
            Línea {{ w.line }}: {{ w.message }}
          </li>
        </ul>
        <ul class="max-h-48 divide-y divide-[#F0EFED] overflow-y-auto text-sm">
          <li v-for="g in bulkResult.guests" :key="g.nombre" class="flex justify-between px-3 py-2">
            <span>{{ g.nombre }}</span><span class="tabular-nums text-[#57534E]">{{ pasesLabel(g.pases) }}</span>
          </li>
        </ul>
      </div>
    </section>

    <!-- Lista -->
    <section class="panel overflow-hidden lg:col-span-2" aria-labelledby="list-title">
      <div class="flex flex-col gap-2 border-b border-[#E7E5E4] p-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 id="list-title" class="font-semibold">
          Lista de invitados · {{ config.titulo }}
          <span class="ml-1 text-sm font-normal text-[#57534E]">({{ list.length }})</span>
        </h2>
        <button type="button" class="btn btn-outline btn-sm" :disabled="!list.length" @click="exportList">
          <Icon name="lucide:download" class="size-4" /> Exportar enlaces CSV
        </button>
      </div>
      <p v-if="!list.length" class="px-6 py-10 text-center text-sm text-[#57534E]">
        Todavía no hay invitados para este evento. Genera enlaces arriba.
      </p>
      <ul v-else class="max-h-[28rem] divide-y divide-[#F0EFED] overflow-y-auto">
        <li v-for="g in list" :key="g.id" class="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center">
          <div class="min-w-0 flex-1">
            <p class="font-medium">
              {{ g.nombre }} <span class="text-sm font-normal text-[#57534E]">· {{ pasesLabel(g.pases) }}</span>
            </p>
            <p class="truncate font-mono text-xs text-[#57534E]">
              {{ guestUrl(g) }}
            </p>
          </div>
          <div class="flex shrink-0 gap-1">
            <button type="button" class="btn btn-ghost btn-sm" :aria-label="`Copiar enlace de ${g.nombre}`" @click="copy(guestUrl(g))">
              <Icon name="lucide:copy" class="size-4" /> Copiar
            </button>
            <a :href="guestWa(g)" target="_blank" rel="noopener" class="btn btn-ghost btn-sm" :aria-label="`Enviar invitación a ${g.nombre} por WhatsApp`">
              <UiWhatsappIcon class="size-4 text-[#1A7F45]" /> WhatsApp
            </a>
            <button type="button" class="btn btn-ghost btn-sm text-rose-700" :aria-label="`Quitar a ${g.nombre}`" @click="guests.remove(g.id)">
              <Icon name="lucide:trash" class="size-4" />
            </button>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>
