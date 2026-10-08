<script setup lang="ts">
import { DEMO_CREDENTIALS } from '~/stores/auth'

definePageMeta({ layout: 'admin', middleware: 'admin' })
useHead({ title: 'Acceso al panel · Demo' })

const auth = useAuthStore()
const user = ref('')
const password = ref('')
const error = ref('')

function fill() {
  user.value = DEMO_CREDENTIALS.user
  password.value = DEMO_CREDENTIALS.password
  error.value = ''
}

async function submit() {
  if (auth.login(user.value, password.value)) await navigateTo('/admin')
  else error.value = 'Usuario o contraseña incorrectos. Usa las credenciales de la demo.'
}
</script>

<template>
  <main class="grid min-h-svh place-items-center px-4 py-10">
    <div class="w-full max-w-sm">
      <NuxtLink to="/" class="mb-6 inline-flex min-h-11 items-center gap-1.5 text-sm text-[#57534E] hover:text-[#1C1917]">
        <Icon name="lucide:chevron-left" class="size-4" /> Volver a los demos
      </NuxtLink>
      <div class="panel p-6 sm:p-8">
        <span class="grid size-11 place-items-center rounded-xl bg-[#1C1917] text-white">
          <Icon name="lucide:mail" class="size-5" />
        </span>
        <h1 class="mt-5 text-xl font-semibold">
          Panel de invitaciones
        </h1>
        <p class="mt-1 text-sm text-[#57534E]">
          Genera enlaces y revisa confirmaciones.
        </p>

        <div class="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          <p class="flex items-center gap-2 font-medium">
            <Icon name="lucide:info" class="size-4" /> Entorno de demostración
          </p>
          <p class="mt-1">
            Usuario <code class="font-semibold">demo</code> · contraseña <code class="font-semibold">demo123</code>.
            Los datos viven solo en este navegador.
          </p>
          <button type="button" class="mt-2 min-h-9 font-medium underline underline-offset-2" @click="fill">
            Rellenar credenciales
          </button>
        </div>

        <form class="mt-6 space-y-4" @submit.prevent="submit">
          <div>
            <label for="user" class="field-label">Usuario</label>
            <input id="user" v-model="user" class="field" autocomplete="username" autocapitalize="none" required>
          </div>
          <div>
            <label for="pass" class="field-label">Contraseña</label>
            <input id="pass" v-model="password" type="password" class="field" autocomplete="current-password" required>
          </div>
          <p v-if="error" class="text-sm text-red-700" role="alert">
            {{ error }}
          </p>
          <button type="submit" class="btn btn-primary w-full">
            Entrar
          </button>
        </form>
      </div>
    </div>
  </main>
</template>
