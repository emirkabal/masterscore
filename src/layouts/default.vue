<script setup>
import { useUserStore } from "../store/user"

const userStore = useUserStore()
const loading = ref(true)
onMounted(async () => {
  await userStore.init()
  loading.value = false
})
</script>
<template>
  <div>
    <div class="min-h-screen">
      <Header />
      <div v-if="loading" class="flex h-96 items-center justify-center">
        <Spinner />
      </div>
      <slot v-else />
    </div>
    <Footer />
  </div>
</template>
