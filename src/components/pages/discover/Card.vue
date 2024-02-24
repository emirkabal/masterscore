<script setup lang="ts">
import type { TMDBSearchResult } from "~/types"

defineProps<{
  meta: TMDBSearchResult
  selected: boolean
}>()
</script>
<template>
  <div class="group w-full cursor-pointer p-4 focus:outline-none" tabindex="0">
    <div
      class="relative aspect-poster overflow-hidden rounded-3xl"
      :class="{
        'ring-4 ring-gray-200': selected
      }"
    >
      <MasterImage
        :source="$timage(meta.poster_path || '', 'w300')"
        class="aspect-poster w-full transition group-hover:scale-110 group-focus:scale-110"
      />
    </div>
    <h3 class="mt-2 line-clamp-2 text-center text-base font-semibold tracking-wide text-gray-100">
      {{ $getTitle(meta) }}
    </h3>
  </div>
</template>
