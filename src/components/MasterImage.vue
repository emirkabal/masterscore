<script setup lang="ts">
const imageLoading = ref(true)

defineProps<{
  source: string
  zIndex?: number
  loading?: boolean
}>()
</script>
<template>
  <div
    v-if="loading"
    class="skeleton-effect flex-shrink-0 bg-gray-300 dark:bg-zinc-800"
  ></div>
  <div
    v-else
    class="flex flex-shrink-0 items-center justify-center overflow-hidden"
  >
    <span
      class="skeleton-effect h-full w-full bg-gray-400 dark:bg-zinc-900"
      v-if="imageLoading && !loading"
    >
    </span>
    <nuxt-img
      :src="source"
      loading="lazy"
      @load="imageLoading = false"
      class="h-full w-full object-cover"
      :class="{
        'pointer-events-none absolute inset-0 -z-10 opacity-0':
          imageLoading && !loading
      }"
      :style="{
        zIndex: zIndex
      }"
      draggable="false"
    />
  </div>
</template>
