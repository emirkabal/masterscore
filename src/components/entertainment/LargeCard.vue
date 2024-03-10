<script setup lang="ts">
const { data } = defineProps<{
  showTitle?: boolean
  showVerified?: boolean
  data: {
    url?: string
    title: string
    poster?: string
    backdrop?: string
    release_date?: string
    rating?: number
  }
}>()
</script>
<template>
  <NuxtLink
    :to="data.url ? `/${data.url}` : undefined"
    class="relative flex w-full max-w-[100px] flex-shrink-0 select-none snap-start flex-col transition-opacity hover:opacity-75 md:max-w-[200px]"
  >
    <div
      v-if="showVerified"
      class="m absolute right-0 top-0 -m-1.5 flex h-10 w-10 items-center justify-center rounded-full bg-gray-950 p-1"
    >
      <Icon name="material-symbols:verified-rounded" class="h-6 w-6 text-brand" />
    </div>
    <div v-if="data.poster">
      <MasterImage
        :source="$timage(data.poster, 'w300')"
        class="h-40 w-full rounded-lg md:h-[300px]"
      />
      <h1
        v-if="showTitle"
        class="mt-1 line-clamp-2 text-center text-sm font-semibold tracking-tight"
      >
        {{ data.title }}
      </h1>
    </div>
    <div
      v-else
      class="flex h-40 w-full flex-shrink-0 items-center justify-center rounded bg-gray-800 text-center font-semibold !text-white md:h-[300px]"
    >
      {{ data.title }}
    </div>
  </NuxtLink>
</template>
