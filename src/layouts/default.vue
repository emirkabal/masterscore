<script setup>
import { useUserStore } from "../store/user"
const route = useRoute()
const userStore = useUserStore()
const loading = ref(true)
if (route.path === "/") loading.value = false
onMounted(async () => {
  await userStore.init()
  loading.value = false
})
</script>
<template>
  <div>
    <div class="min-h-screen">
      <Header />
      <div
        v-if="loading"
        class="fixed top-0 left-0 z-50 flex h-screen w-full items-center justify-center bg-gray-900"
      >
        <Spinner />
      </div>
      <slot v-else />
    </div>
    <Footer />
  </div>
</template>
