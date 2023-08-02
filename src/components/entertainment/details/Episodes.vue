<script lang="ts" setup>
import { TMDBData } from "@types"

const props = defineProps<{
  data: TMDBData
}>()

const seasons = computed(() => {
  return props.data.seasons
    ? props.data.seasons.filter((season) => season.season_number !== 0)
    : []
})

const seasonData = reactive({
  ...Object.fromEntries(
    seasons.value.map((season) => [season.id, { show: false }])
  )
})
</script>
<template>
  <div>
    <h1
      class="my-4 border-l-4 border-green-500 pl-4 text-2xl font-bold tracking-wide"
    >
      Episodes
    </h1>
    <div class="flex flex-col gap-2">
      <div
        v-for="item in seasons"
        :key="item.id"
        @click="seasonData[item.id].show = !seasonData[item.id].show"
        class="cursor-pointer rounded border p-2 hover:opacity-90 dark:border-zinc-800"
      >
        <div class="flex min-w-0 select-none items-center gap-2">
          <span class="w-20 flex-shrink-0 text-lg font-semibold">{{
            item.name
          }}</span>
          <span
            class="mr-auto w-24 flex-shrink-0 text-gray-400 dark:text-zinc-400"
            >{{ item.episode_count }} Episodes</span
          >
          <IconsChevron
            :class="{
              '-rotate-90': seasonData[item.id].show,
              'rotate-180': !seasonData[item.id].show
            }"
          />
        </div>
      </div>
    </div>
  </div>
</template>
