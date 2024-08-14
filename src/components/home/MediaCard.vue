<script setup lang="ts">
const { $timage } = useNuxtApp()
defineProps<{
  to: string
  title: string
  subtitle: string
  poster: string
}>()
</script>

<template>
  <NuxtLink class="flex w-fit items-center gap-4 transition-opacity hover:opacity-75" :to="to">
    <MasterImage
      class="aspect-square size-14 rounded-xl sm:size-16"
      :source="$timage(poster, 'w92')"
    />
    <div>
      <h4 class="line-clamp-1 font-semibold tracking-tight sm:text-xl">{{ title }}</h4>
      <p class="text-sm tracking-tight opacity-75 sm:text-lg">{{ subtitle }}</p>
    </div>
  </NuxtLink>
</template>
