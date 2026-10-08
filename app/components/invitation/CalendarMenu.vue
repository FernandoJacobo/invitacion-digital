<script setup lang="ts">
import type { Lugar } from '~/events/types'

/** Botón "Agregar al calendario" con opciones: Google, Outlook o descarga `.ics` (Apple y otros). */
const props = defineProps<{ lugar: Lugar }>()
const { config } = useInvitation()
const calendar = useCalendar(config)

const open = ref(false)
const root = ref<HTMLElement>()
const menuId = useId()

onClickOutside(root, () => (open.value = false))
onKeyStroke('Escape', () => {
  if (open.value) open.value = false
})

function download() {
  calendar.download(props.lugar)
  open.value = false
}
</script>

<template>
  <div ref="root" class="relative">
    <button
      type="button"
      class="btn btn-outline btn-sm w-full"
      :aria-expanded="open"
      :aria-controls="menuId"
      @click="open = !open"
    >
      <Icon name="lucide:calendar-plus" class="size-4" />
      Agregar al calendario
      <Icon name="lucide:chevron-down" class="size-4 transition-transform" :class="open ? 'rotate-180' : ''" />
    </button>
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-1"
      leave-active-class="transition duration-150 ease-in"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <ul
        v-if="open"
        :id="menuId"
        class="absolute inset-x-0 bottom-full z-20 mb-2 overflow-hidden rounded-2xl border border-line bg-surface p-1.5 shadow-xl"
      >
        <li>
          <a :href="calendar.google(lugar)" target="_blank" rel="noopener" class="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm hover:bg-surface-alt" @click="open = false">
            <Icon name="lucide:calendar" class="size-4 text-accent-ink" /> Google Calendar
          </a>
        </li>
        <li>
          <a :href="calendar.outlook(lugar)" target="_blank" rel="noopener" class="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm hover:bg-surface-alt" @click="open = false">
            <Icon name="lucide:mail" class="size-4 text-accent-ink" /> Outlook
          </a>
        </li>
        <li>
          <button type="button" class="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm hover:bg-surface-alt" @click="download">
            <Icon name="lucide:download" class="size-4 text-accent-ink" /> Apple / otro (.ics)
          </button>
        </li>
      </ul>
    </Transition>
  </div>
</template>
