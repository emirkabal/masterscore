<script setup>
const loading = ref(false)
const getRandomMovie = async () => {
  loading.value = true
  const data = await $fetch("/api/random/movie", {
    headers: generateHeaders()
  })
  loading.value = false

  useRouter().push(`/details/movie/${data.id}`)
}
</script>
<template>
  <div
    v-if="loading"
    class="bg-gray-50 dark:bg-zinc-900 rounded-3xl flex justify-center flex-col items-center p-8 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all duration-300 ease-in-out h-44"
  >
    <Spinner />
  </div>
  <button
    v-else
    @click="getRandomMovie"
    class="bg-gray-50 dark:bg-zinc-900 rounded-3xl flex justify-center flex-col items-center p-8 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all duration-300 ease-in-out"
  >
    <IconsHeart class="w-16 h-16 text-blue-600" />
    <h1 class="font-maven font-black">
      <span class="text-blue-600">r</span>andom movie
    </h1>
    <p class="text-center text-gray-500 dark:text-gray-400">
      Show a random movie
    </p>
  </button>
</template>
