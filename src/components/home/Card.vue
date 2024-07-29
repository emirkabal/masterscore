<script setup lang="ts">
defineProps<{
  to: string
  title: string
  subtitle: string
  poster: string
}>()
</script>

<template>
  <NuxtLink class="flex w-fit items-center gap-4 transition-opacity hover:opacity-75" :to="to">
    <MasterImage class="aspect-square h-16 w-16 rounded-xl" :source="$timage(poster, 'w92')" />
    <div>
      <h4 class="text-xl font-semibold tracking-tight">{{ title }}</h4>
      <p class="text-lg tracking-tight opacity-75">{{ subtitle }}</p>
    </div>
  </NuxtLink>
</template>
