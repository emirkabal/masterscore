<script lang="ts" setup>
defineProps<{
  title: string
  tags: { name: string; url: string }[]
}>()
</script>

<template>
  <section class="py-2">
    <h4 class="mb-2 text-base font-bold text-gray-200">{{ title }}</h4>
    <div class="flex flex-wrap gap-2">
      <NuxtLink
        v-for="tag in tags"
        :key="tag.name"
        :to="tag.url"
        class="rounded-full bg-gray-400/20 px-2 py-1 font-medium text-gray-100 hover:bg-gray-400/40"
      >
        {{ tag.name }}
      </NuxtLink>
    </div>
  </section>
</template>
