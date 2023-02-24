<script setup>
const props = defineProps({
  collapsed: {
    type: Boolean,
    default: false
  }
})
const loading = ref(false)
const getRandomMovie = async () => {
  loading.value = true
  const data = await $fetch("/api/random/movie", {
    headers: generateHeaders()
  })

  useRouter().push(`/details/movie/${data.id}?feature=random`)
}
</script>
<template>
  <div
    v-if="loading"
    class="bg-gray-50 dark:bg-zinc-900 rounded-3xl flex justify-center flex-col items-center hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all duration-300 ease-in-out"
    :class="{
      'p-6': collapsed,
      'h-12': collapsed,
      'h-44': !collapsed,
      'p-8': !collapsed
    }"
  >
    <Spinner v-if="!collapsed" />
    <div
      v-else
      class="flex items-center justify-center space-x-2 animate-pulse"
    >
      <div class="w-4 h-4 dark:bg-white/60 bg-black/60 rounded-full"></div>
      <div class="w-4 h-4 dark:bg-white/80 bg-black/80 rounded-full"></div>
      <div class="w-4 h-4 dark:bg-white/90 bg-black/90 rounded-full"></div>
    </div>
  </div>
  <button
    v-else
    @click="getRandomMovie"
    class="bg-gray-50 dark:bg-zinc-900 rounded-3xl flex justify-center flex-col items-center hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all duration-300 ease-in-out"
    :class="collapsed ? 'p-6' : 'p-8'"
  >
    <IconsHeart v-if="!collapsed" class="w-16 h-16 text-blue-600" />
    <h1 class="font-maven font-black">
      <span class="text-blue-600">r</span>andom movie
    </h1>
    <p
      class="text-center text-gray-500 dark:text-gray-300 flex items-center gap-2"
    >
      {{ collapsed ? "Next movie" : "Show random movie" }}
      <IconsRightArrow v-if="collapsed" class="w-6 h-6 text-blue-600" />
    </p>
  </button>
</template>
