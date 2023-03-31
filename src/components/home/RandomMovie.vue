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
  const data = await $fetch("/api/extra/random/movie", {
    headers: generateHeaders()
  })

  useRouter().push(`/details/movie/${data.id}?feature=random`)
}
</script>
<template>
  <div
    v-if="loading"
    class="flex flex-col items-center justify-center rounded-3xl bg-gray-50 transition-all duration-300 ease-in-out hover:bg-gray-100 dark:bg-zinc-900 dark:hover:bg-zinc-800"
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
      class="skeleton-effect flex items-center justify-center space-x-2"
    >
      <div class="h-4 w-4 rounded-full bg-black/60 dark:bg-white/60"></div>
      <div class="h-4 w-4 rounded-full bg-black/80 dark:bg-white/80"></div>
      <div class="h-4 w-4 rounded-full bg-black/90 dark:bg-white/90"></div>
    </div>
  </div>
  <button
    v-else
    @click="getRandomMovie"
    class="flex flex-col items-center justify-center rounded-3xl bg-gray-50 drop-shadow-xl transition-all duration-300 ease-in-out hover:bg-gray-100 dark:bg-zinc-900 dark:hover:bg-zinc-800"
    :class="collapsed ? 'p-6' : 'p-8'"
  >
    <IconsHeart v-if="!collapsed" class="h-16 w-16 text-blue-600" />
    <h1 class="font-maven font-black">
      <span class="text-blue-600">r</span>andom movie
    </h1>
    <p
      class="flex items-center gap-2 text-center text-gray-500 dark:text-gray-300"
    >
      {{ collapsed ? "Next movie" : "Show random movie" }}
      <IconsRightArrow v-if="collapsed" class="h-6 w-6 text-blue-600" />
    </p>
  </button>
</template>
