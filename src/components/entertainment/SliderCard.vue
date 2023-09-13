<script setup lang="ts">
defineProps<{
  loading?: boolean
  id?: string | number
  media_type?: string
  image?: string
  rating?: number
  size?: "default" | "large"
}>()
</script>
<template>
  <NuxtLink
    :to="`/details/${media_type}/${id}`"
    class="relative h-full w-full bg-cover bg-center bg-no-repeat transition-opacity hover:opacity-90"
    :class="{
      'skeleton-effect pointer-events-none relative': loading,
      'h-40 w-[100px] rounded-xl lg:h-[513px] lg:w-[342px]': size === 'large',
      'h-40 w-[100px] rounded-lg lg:h-[300px] lg:w-[200px]': size !== 'large'
    }"
  >
    <MasterImage
      :loading="loading"
      :source="image || 'none'"
      :class="{
        'h-40 w-[100px] rounded-xl lg:h-[513px] lg:w-[342px]': size === 'large',
        'h-40 w-[100px] rounded-lg lg:h-[300px] lg:w-[200px]': size !== 'large'
      }"
    />
    <ScoreCircle
      v-if="rating"
      :score="rating"
      class="absolute bottom-0 m-2 text-sm lg:m-4 lg:text-lg"
    />
  </NuxtLink>
</template>
