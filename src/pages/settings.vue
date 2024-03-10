<script lang="ts" setup>
import { useUserStore } from "~/store/user"
const { user } = useUserStore()

const settings = reactive({
  account: {
    username: user?.username || "",
    about: user?.about || "",
    email: user?.email || ""
  }
})
</script>

<template>
  <div class="mt-36">
    <div class="mx-auto w-[1300px] max-w-full px-8 sm:px-16">
      <div class="grid gap-12 lg:grid-cols-[280px,1fr]">
        <div class="hidden lg:block">
          <span class="text-sm font-bold uppercase tracking-wide text-gray-500"> Ayarlar </span>
        </div>
        <div class="space-y-12">
          <PagesSettingsPartsAccount :settings="settings" />
          <PagesSettingsPartsPreferences />
        </div>
      </div>
    </div>
  </div>
</template>
