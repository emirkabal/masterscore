<script setup>
import { useLocalStorage } from "@vueuse/core"
import { useUserStore } from "~/store/user"
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const { isMobileOrTablet } = useDevice()

if (process.client) userStore.init()

const notify = useLocalStorage("notify-discover-restored", true)

const handleNotify = () => {
  router.push("/discover")
  notify.value = false
}
</script>
<template>
  <div>
    <ClientOnly>
      <div
        v-if="notify && route.path !== '/discover' && !isMobileOrTablet"
        class="flex h-10 w-full items-center justify-center gap-x-4 bg-blue-700 text-sm text-white"
      >
        <p>
          <i18n-t keypath="notify.template" scope="global">
            <template v-slot>
              <span class="font-semibold">
                {{ $t("discover.title") }}
              </span>
            </template>
          </i18n-t>
        </p>
        <button
          @click="handleNotify"
          class="rounded border px-2 py-1 font-semibold transition hover:bg-white hover:text-background"
        >
          {{ $t("notify.button") }}
        </button>
      </div>
    </ClientOnly>
    <div class="relative min-h-screen">
      <Header />
      <!-- <div
        class="fixed left-0 top-0 z-50 flex h-screen w-full items-center justify-center bg-gray-900"
      >
        <Loader />
      </div> -->

      <div class="w-full">
        <NuxtPage />
      </div>
    </div>
    <Footer />
    <!-- PWA -->
    <ClientOnly>
      <div
        v-if="$pwa?.needRefresh"
        class="fixed bottom-8 left-1/2 z-50 w-full max-w-lg -translate-x-1/2 px-4 sm:px-0"
        role="alert"
      >
        <div
          class="flex w-full items-center justify-between rounded-lg border border-yellow-500/10 bg-yellow-500/10 p-2 text-sm shadow backdrop-blur-xl sm:max-w-lg"
        >
          <div class="flex items-center gap-2">
            <div class="flex items-center justify-center rounded-lg bg-yellow-500 p-2">
              <Icon name="ic:outline-file-download" class="h-5 w-5 flex-shrink-0" />
            </div>

            <p class="font-bold">New content available</p>
          </div>
          <div class="flex items-center gap-4">
            <button
              class="opacity-75 transition-opacity hover:opacity-100"
              @click="$pwa.cancelPrompt()"
            >
              Cancel
            </button>
            <button
              class="rounded-lg bg-yellow-500 px-4 py-2 font-semibold transition-colors hover:bg-yellow-600"
              @click="$pwa.updateServiceWorker()"
            >
              Reload
            </button>
          </div>
        </div>
      </div>
      <div
        v-if="$pwa?.showInstallPrompt && !$pwa?.needRefresh"
        class="fixed bottom-8 left-1/2 z-50 w-full max-w-lg -translate-x-1/2 px-4 sm:px-0"
        role="alert"
      >
        <div
          class="flex w-full items-center justify-between rounded-lg border border-yellow-500/10 bg-yellow-500/10 p-2 text-sm shadow backdrop-blur-xl sm:max-w-lg"
        >
          <div class="flex items-center gap-2">
            <div class="flex items-center justify-center rounded-lg bg-yellow-500 p-2">
              <Icon name="ic:outline-file-download" class="h-5 w-5 flex-shrink-0" />
            </div>

            <p class="font-bold">
              Install
              {{ isMobileOrTablet ? "homepage" : "desktop" }} application
            </p>
          </div>
          <div class="flex items-center gap-4">
            <button
              class="opacity-75 transition-opacity hover:opacity-100"
              @click="$pwa.cancelInstall()"
            >
              Cancel
            </button>
            <button
              class="rounded-lg bg-yellow-500 px-4 py-2 font-semibold transition-colors hover:bg-yellow-600"
              @click="$pwa.install()"
            >
              Install
            </button>
          </div>
        </div>
      </div>
    </ClientOnly>
  </div>
</template>
