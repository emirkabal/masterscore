<script setup>
const { $router, $event } = useNuxtApp()

watch($router.currentRoute, () => {
  document.body.style.overflow = "auto"
  $event("modal:trailer", false)
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
