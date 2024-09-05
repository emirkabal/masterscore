<script setup>
import { useIntervalFn } from "@vueuse/core"

const { $router, $event } = useNuxtApp()

watch($router.currentRoute, () => {
  document.body.style.overflow = "auto"
  $event("modal:trailer", false)
})

useIntervalFn(() => {
  if (import.meta.client) {
    const modal = document.querySelector(".modal")
    const popover = document.querySelector("[data-radix-popper-content-wrapper]")
    document.body.style.overflow = modal || popover ? "hidden" : "auto"
  }
}, 300)

const title = "Masterscore"
const description =
  "Masterscore is a movie and TV review website with unbiased reviews, recommendations, and ratings on various genres. Find your next favorite show or movie with us!"

useSeoMeta({
  title,
  description,
  titleTemplate: "%s - Masterscore",
  ogTitle: title,
  ogDescription: description,
  twitterCard: "summary",
  twitterTitle: title,
  twitterDescription: description,
  ogUrl: "https://masterscore.org"
})
</script>

<template>
  <VitePwaManifest />
  <NuxtLoadingIndicator color="#eab308" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
body {
  overflow-x: hidden !important;
}
</style>
