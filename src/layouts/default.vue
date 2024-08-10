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
</template>
