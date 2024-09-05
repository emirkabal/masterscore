<script setup lang="ts">
const error = useError()
const config = useRuntimeConfig()

const handleError = () => {
  clearError({
    redirect: "/"
  })
}
</script>

<template>
  <div class="items relative mx-auto flex h-screen text-left font-maven">
    <img
      src="~/assets/images/bg.jpg"
      class="absolute h-screen w-full object-cover"
      draggable="false"
    />
    <div
      class="absolute left-0 top-0 z-10 h-screen w-full bg-gradient-to-r from-black/90 backdrop-blur-md"
    ></div>
    <div class="absolute bottom-0 left-0 z-20 m-12">
      <span class="select-none font-maven text-4xl font-black text-brand">m</span>
    </div>
    <div class="z-20 w-fit max-w-2xl p-12">
      <h1 class="mb-2 text-4xl font-bold">{{ error?.statusCode }}</h1>
      <p class="mb-8 text-lg text-gray-200">{{ error.statusMessage }}</p>
      <div v-if="config.public.IS_DEV" class="my-8 border-2 border-yellow-500 bg-zinc-950 p-4">
        <code class="text-xs text-yellow-100">#is_dev<br /></code>
        <code class="text-red-500">{{ error.stack }}</code>
      </div>
      <button
        @click="handleError"
        class="w-full max-w-52 rounded bg-white px-4 py-2 font-maven font-bold text-black hover:bg-gray-200"
      >
        Go back to home
      </button>
    </div>
  </div>
</template>
