<script setup lang="ts">
import { useUserStore } from "~/store/user"
const { user, isLoggedIn } = useUserStore()

defineProps<{
  settings: {
    account: {
      username: string
    }
  }
}>()
</script>

<template>
  <section id="settings-account">
    <h1 class="mb-9 border-b border-gray-800 pb-4 text-3xl font-bold text-white lg:text-5xl">
      Hesap
    </h1>
    <div class="w-full space-y-6 rounded-xl border border-gray-800 bg-gray-900/40 p-12">
      <div>
        <span class="mb-2 block text-lg font-semibold tracking-tight text-white">
          Profil fotoğrafı
        </span>
        <UiInput class="h-10 w-full" placeholder="rickrolled" v-model="settings.account.username" />
      </div>
      <div>
        <span class="mb-2 block text-lg font-semibold tracking-tight text-white"> Hesap adı </span>
        <UiInput class="h-10 w-full" placeholder="rickrolled" v-model="settings.account.username" />
      </div>
    </div>
  </section>
</template>
