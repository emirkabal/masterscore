<script lang="ts" setup>
import { useUserStore } from "~/store/user"
const userStore = useUserStore()

await userStore.waitForUser()

const settings = reactive({
  account: {
    display_name: userStore.user?.display_name,
    username: userStore.user?.username,
    about: userStore.user?.about,
    avatar: userStore.user?.avatar,
    banner: userStore.user?.banner
  }
})

let defaultSettings = JSON.stringify(settings)

const showSave = ref(false)

const reset = () => {
  Object.assign(settings, JSON.parse(defaultSettings))
}

const submit = () => {
  patchUser(settings.account)
    .then(() => {
      defaultSettings = JSON.stringify(settings)
      showSave.value = false
    })
    .catch((err) => {
      alert(err.statusMessage)
    })
}

watch(settings, () => {
  if (JSON.stringify(settings) !== defaultSettings) {
    showSave.value = true
  } else {
    showSave.value = false
  }
})
</script>

<template>
  <div class="bg-gradient-to-tr from-gray-950 via-gray-950 via-65% to-[#232054]">
    <div class="mx-auto w-[1300px] max-w-full px-8 pb-96 pt-36 sm:px-16">
      <div class="grid gap-12 lg:grid-cols-[280px,1fr]">
        <div class="sticky top-24 hidden h-fit lg:block">
          <span class="text-sm font-bold uppercase tracking-wide text-gray-500">
            {{ $t("settings.title") }}
          </span>
          <div class="mt-4 space-y-4">
            <PagesSettingsNavigation />
          </div>
        </div>
        <div class="space-y-24" id="tabs">
          <PagesSettingsPartsAccount v-if="userStore.isLoggedIn" :settings="settings" />
          <PagesSettingsPartsProfile v-if="userStore.isLoggedIn" :settings="settings" />
          <PagesSettingsPartsPreferences />
        </div>
      </div>
      <div v-if="showSave" class="fixed bottom-12 left-1/2 z-10 w-full -translate-x-1/2 sm:w-fit">
        <div
          class="flex flex-wrap items-center justify-between gap-x-8 gap-y-4 rounded-lg border border-border bg-gray-900 p-2"
        >
          <span class="sm:whitespace-nowrap"> {{ $t("settings.save_text") }} </span>
          <div class="flex gap-x-2 text-sm">
            <Button variant="ghost" @click="reset">{{ $t("settings.reset") }}</Button>
            <Button @click="submit"> {{ $t("entertainment.buttons.save") }} </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
