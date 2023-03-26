<script setup>
import { useUserStore } from "../store/user"
const route = useRoute()
const userStore = useUserStore()
const loading = ref(true)
if (route.path === "/") loading.value = false
onMounted(async () => {
  await userStore.init()
  loading.value = false
})
</script>
<template>
  <div>
    <div class="min-h-screen">
      <Header />
      <div
        v-if="loading"
        class="fixed top-0 left-0 z-50 flex h-screen w-full items-center justify-center bg-gray-900"
      >
        <Spinner />
      </div>
      <slot v-else />
    </div>
    <Footer />
    <ClientOnly>
      <div
        v-if="$pwa?.offlineReady || $pwa?.needRefresh"
        class="pwa-toast"
        role="alert"
      >
        <div class="message">
          <span v-if="$pwa.offlineReady"> App ready to work offline </span>
          <span v-else>
            New content available, click on reload button to update.
          </span>
        </div>
        <div class="flex items-center gap-2">
          <button v-if="$pwa.needRefresh" @click="$pwa.updateServiceWorker()">
            Reload
          </button>
          <button @click="$pwa.cancelPrompt()">Close</button>
        </div>
      </div>
      <div
        v-if="
          $pwa?.showInstallPrompt && !$pwa?.offlineReady && !$pwa?.needRefresh
        "
        class="pwa-toast"
        role="alert"
      >
        <div class="flex items-center gap-2">
          <IconsDownload class="flex-shrink-0" />
          <div class="message">
            <span> Install PWA </span>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button @click="$pwa.install()">Install</button>
          <button @click="$pwa.cancelInstall()">Cancel</button>
        </div>
      </div>
    </ClientOnly>
  </div>
</template>

<style>
.pwa-toast {
  @apply fixed left-1/2 bottom-20 z-50 mx-auto flex w-full max-w-xs -translate-x-1/2 flex-col items-center  justify-between gap-2 rounded-3xl bg-yellow-400/40 p-6 shadow-2xl backdrop-blur-md dark:bg-yellow-400/40 sm:max-w-sm sm:flex-row;
}
.pwa-toast .message {
  @apply flex flex-shrink-0 items-center justify-center font-semibold;
}
.pwa-toast button {
  @apply rounded bg-white px-2 py-1 font-bold !text-black transition-colors hover:bg-gray-200;
}
</style>
