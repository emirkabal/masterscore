<script setup>
const { $router, $event } = useNuxtApp()

watch($router.currentRoute, () => {
  document.body.style.overflow = "auto"
  $event("modal:trailer", false)
})

onMounted(() => {
  if (!process.client) return
  setInterval(() => {
    const modal = document.querySelector(".modal")
    if (modal) document.body.style.overflow = "hidden"
    else document.body.style.overflow = "auto"
  }, 300)
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
