<script setup lang="ts">
const { data } = defineProps<{
  data: {
    id: number
    name: string
    profile_path: string
    attr: string
  }
}>()
</script>

<template>
  <NuxtLink
    class="flex w-full max-w-[100px] flex-shrink-0 select-none snap-start flex-col transition-opacity hover:opacity-75 md:max-w-[140px]"
    :to="`/details/person/${data.id}`"
  >
    <div class="flex w-full flex-col items-center justify-center rounded">
      <MasterImage
        :source="$timage(data.profile_path || '-', 'w300')"
        class="h-32 w-[85px] rounded-lg md:h-[240px] md:w-[140px]"
      />
      <div
        class="mt-2 flex h-full w-full flex-col items-center justify-center pt-2 text-center font-maven"
      >
        <p class="line-clamp-2 break-words text-xs font-semibold md:text-base">
          {{ data.name }}
        </p>
        <p class="line-clamp-1 break-words text-xs md:text-base" v-if="data.attr">
          {{ data.attr }}
        </p>
      </div>
    </div>
  </NuxtLink>
</template>
