<script setup lang="ts">
const { posterURL, rating, loading } = defineProps<{
  posterURL?: string
  rating?: number
  loading?: boolean
}>()
</script>

<template>
  <div class="relative flex-shrink-0">
    <div v-if="loading">
      <div
        class="skeleton-effect flex h-[336px] w-56 items-center justify-center rounded-2xl bg-gray-300 text-xl font-semibold dark:bg-gray-800 lg:h-[450px] lg:w-[300px]"
      ></div>
    </div>
    <div v-else>
      <MasterImage
        :source="posterURL || '-'"
        class="h-[336px] w-56 rounded-2xl object-cover object-center lg:h-[450px] lg:w-[300px]"
      />
    </div>
  </div>
</template>
