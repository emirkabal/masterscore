<script setup lang="ts">
const imageLoading = ref(true)
const noImage = ref(false)

const props = defineProps<{
  source: string
  zIndex?: number
  loading?: boolean
}>()

const source = computed(() => {
  return props.source.endsWith("-") ? "#" : props.source
})
</script>
<template>
  <div v-if="loading" class="skeleton-effect flex-shrink-0 bg-gray-900"></div>
  <div v-else class="flex flex-shrink-0 items-center justify-center overflow-hidden">
    <span v-if="imageLoading && !noImage" class="skeleton-effect h-full w-full bg-gray-900"> </span>
    <div
      v-if="noImage"
      class="flex h-full w-full flex-col items-center justify-center gap-2 bg-gray-900 text-zinc-500"
    >
      <Icon name="material-symbols:image-not-supported-outline-rounded" color="white" size="36" />
    </div>
    <nuxt-img
      v-else
      :src="source"
      loading="lazy"
      @load="imageLoading = false"
      @error=";[(imageLoading = false), (noImage = true)]"
      class="h-full w-full object-cover"
      :class="{
        'pointer-events-none absolute inset-0 -z-10 h-1 w-1 opacity-0': imageLoading && !loading
      }"
      :style="{
        zIndex: zIndex
      }"
      draggable="false"
    />
  </div>
</template>
