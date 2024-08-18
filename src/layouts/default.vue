<script setup>
import { useLocalStorage } from "@vueuse/core"
import { useUserStore } from "~/store/user"
const router = useRouter()
const userStore = useUserStore()

if (import.meta.client) userStore.init()

const notify = useLocalStorage("notify-discover-restored", true)

const handleNotify = () => {
  router.push("/discover")
  notify.value = false
}
</script>
<template>
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
