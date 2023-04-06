<script setup>
const following = ref(true)
</script>
<template>
  <button
    v-if="following"
    @click="following = !following"
    class="flex h-10 select-none items-center gap-2 rounded border border-white px-4 py-2 font-semibold hover:opacity-75"
  >
    <IconsDoubleCheck class="text-white" />
    Following
  </button>
  <button
    v-else
    @click="following = !following"
    class="flex h-10 select-none items-center gap-2 rounded bg-white px-4 py-2 font-maven font-semibold text-black transition hover:bg-gray-300"
  >
    <IconsPlus class="-ml-0.5 text-black" />
    Follow
  </button>
</template>
