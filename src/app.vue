<script setup>
import { useLocalStorage } from "@vueuse/core"

const { $router, $event } = useNuxtApp()

watch($router.currentRoute, () => {
  document.body.style.overflow = "auto"
  $event("modal:trailer", false)
})
let interval

onMounted(() => {
  if (process.client) {
    interval = setInterval(() => {
      const modal = document.querySelector(".modal")
      const popover = document.querySelector("[data-radix-popper-content-wrapper]")
      document.body.style.overflow = modal || popover ? "hidden" : "auto"
    }, 300)
  }
})

onUnmounted(() => {
  if (interval) clearInterval(interval)
})
</script>

<template>
  <VitePwaManifest />
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
body {
  overflow-x: hidden !important;
}
</style>
