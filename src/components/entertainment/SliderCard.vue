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
    :to="`/${media_type}/${id}`"
    class="relative h-full w-full bg-cover bg-center bg-no-repeat transition-opacity hover:opacity-90"
    :class="{
      'skeleton-effect pointer-events-none relative': loading,
      '3xl:h-[500px] 3xl:w-[342px] h-[135px] w-[90px] rounded-xl sm:h-[300px] sm:w-[199.98px] lg:h-[400px] lg:w-[266.65px]':
        size === 'large',
      'h-40 w-[100px] rounded-lg lg:h-[300px] lg:w-[200px]': size !== 'large'
    }"
  >
    <MasterImage
      :loading="loading"
      :source="image || 'none'"
      :class="{
        '3xl:h-[500px] 3xl:w-[342px] h-[135px] w-[90px] rounded-xl sm:h-[300px] sm:w-[199.98px] lg:h-[400px] lg:w-[266.65px]':
          size === 'large',
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
