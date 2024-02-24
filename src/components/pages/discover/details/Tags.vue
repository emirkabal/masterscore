<script lang="ts" setup>
defineProps<{
  title: string
  tags: { name: string; url: string }[]
}>()
</script>

<template>
  <section class="py-2 font-sans">
    <h4 class="mb-2 text-base font-semibold uppercase tracking-tight text-gray-200/30">
      {{ title }}
    </h4>
    <div class="flex flex-wrap gap-2">
      <NuxtLink
        v-for="tag in tags"
        :key="tag.name"
        :to="tag.url"
        class="rounded-full bg-gray-400/10 px-5 py-1.5 font-medium text-gray-200 hover:bg-gray-400/40"
      >
        {{ tag.name }}
      </NuxtLink>
    </div>
  </section>
</template>
