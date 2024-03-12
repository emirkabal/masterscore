<script setup>
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
      document.body.style.overflow = modal ? "hidden" : "auto"
    }, 300)
  }
})

onUnmounted(() => {
  if (interval) clearInterval(interval)
})
</script>

<template>
  <div>
    <VitePwaManifest />
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style>
body {
  overflow-x: hidden !important;
}
</style>
