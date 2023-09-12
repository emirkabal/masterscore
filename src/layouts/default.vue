<script setup>
import { useUserStore } from "~/store/user"
const route = useRoute()
const userStore = useUserStore()
const loading = ref(true)

if (route.path === "/" || route.path.startsWith("/details/person/")) {
  loading.value = false
}
userStore.init()

watch(
  userStore,
  () => {
    if (userStore.loading === false) {
      loading.value = false
    }
  },
  {
    deep: true,
    immediate: true
  }
)
</script>
<template>
  <div>
    <div class="min-h-[90vh]">
      <Header />
      <div
        v-if="loading"
        class="fixed left-0 top-0 z-50 flex h-screen w-full items-center justify-center bg-gray-900"
      >
        <Loader />
      </div>

      <div class="w-full" v-else>
        <slot />
      </div>
    </div>
    <Footer />
    <ClientOnly>
      <div v-if="$pwa?.needRefresh" class="pwa-toast" role="alert">
        <div class="message">
          <span> New content available </span>
        </div>
        <div class="flex items-center gap-2">
          <button v-if="$pwa.needRefresh" @click="$pwa.updateServiceWorker()">
            Reload
          </button>
          <button @click="$pwa.cancelPrompt()">Close</button>
        </div>
      </div>
      <div
        v-if="$pwa?.showInstallPrompt && !$pwa?.needRefresh"
        class="pwa-toast"
        role="alert"
      >
        <div class="flex items-center gap-2">
          <Icon name="ic:outline-file-download" class="h-6 w-6 flex-shrink-0" />
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
  @apply fixed bottom-6 left-1/2 z-50 mx-auto flex w-full max-w-xs -translate-x-1/2 flex-col items-center  justify-between gap-2 rounded-3xl bg-yellow-400/40 p-6 shadow-2xl backdrop-blur-md dark:bg-yellow-400/40 sm:max-w-sm sm:flex-row;
}
.pwa-toast .message {
  @apply flex flex-shrink-0 items-center justify-center font-semibold;
}
.pwa-toast button {
  @apply rounded bg-white px-2 py-1 font-bold !text-black transition-colors hover:bg-gray-200;
}
</style>
