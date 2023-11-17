<script setup>
const props = defineProps({
  error: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="items relative mx-auto flex h-screen flex-col justify-center text-center font-maven">
    <img
      src="~/assets/images/bg.jpg"
      class="absolute h-screen w-full object-cover"
      draggable="false"
    />
    <div
      class="absolute left-0 top-0 z-10 h-screen w-full bg-gradient-to-t from-yellow-500/80 backdrop-blur-md"
    ></div>
    <div class="z-20 mx-auto w-fit rounded-3xl bg-black/20 p-12 text-white drop-shadow-2xl">
      <h1 class="mb-2 text-6xl font-bold sm:text-9xl">404</h1>
      <p class="mb-3 text-xl">Page not found.</p>
      <NuxtLink
        to="/"
        class="w-full rounded bg-white px-4 py-2 font-maven font-bold text-black hover:bg-gray-200"
        >Go back to home</NuxtLink
      >
    </div>
  </div>
</template>
