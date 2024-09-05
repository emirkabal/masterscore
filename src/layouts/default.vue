<script setup>
import { useUserStore } from "~/store/user"
const userStore = useUserStore()

if (import.meta.client) userStore.init()
</script>
<template>
  <Header />
  <NuxtPage />
  <Footer />
</template>
