<script setup lang="ts">
import { CreditsResult } from "@types"

const { data, loading } = defineProps<{
  data?: {
    cast: CreditsResult[]
    crew: CreditsResult[]
  }
  loading?: boolean
}>()

const crew = computed(() => {
  if (!data) return []
  return data.crew
    .filter((c) => c.profile_path)
    .sort((a, b) =>
      a.popularity > b.popularity ? -1 : b.popularity > a.popularity ? 1 : 0
    )
})
const cast = computed(() => {
  if (!data) return []
  return data.cast.filter((c) => c.profile_path)
})
</script>
<template>
  <section class="overflow-hidden">
    <h1
      class="my-4 border-l-4 border-blue-700 pl-4 text-2xl font-bold tracking-wide"
    >
      Cast & Crew
    </h1>
    <div v-if="loading || !data" class="space-y-2">
      <div class="flex gap-2 overflow-x-hidden">
        <div class="flex flex-col" v-for="i in 8" :key="i">
          <div
            class="skeleton-effect h-64 w-[140px] rounded bg-gray-300 dark:bg-zinc-800 md:w-[160px]"
          ></div>
          <div
            class="skeleton-effect mt-2 h-2 w-4/5 self-center rounded-full bg-gray-300 dark:bg-zinc-800"
          ></div>
          <div
            class="skeleton-effect mt-2 h-2 w-3/4 self-center rounded-full bg-gray-300 dark:bg-zinc-800"
          ></div>
        </div>
      </div>
      <div class="flex gap-2 overflow-x-hidden">
        <div class="flex flex-col" v-for="i in 8" :key="i">
          <div
            class="skeleton-effect h-64 w-[140px] rounded bg-gray-300 dark:bg-zinc-800 md:w-[160px]"
          ></div>
          <div
            class="skeleton-effect mt-2 h-2 w-4/5 self-center rounded-full bg-gray-300 dark:bg-zinc-800"
          ></div>
          <div
            class="skeleton-effect mt-2 h-2 w-3/4 self-center rounded-full bg-gray-300 dark:bg-zinc-800"
          ></div>
        </div>
      </div>
    </div>
    <div v-else-if="cast.length > 0 || crew.length > 0" class="space-y-2">
      <OverflowBehavior v-if="cast.length > 0">
        <PersonCard
          v-for="(item, i) in cast"
          :key="'cast-' + i"
          :data="{
            id: item.id,
            name: item.name,
            profile_path: item.profile_path,
            attr: item.character
          }"
        />
      </OverflowBehavior>
      <OverflowBehavior v-if="crew.length > 0">
        <PersonCard
          v-for="(item, i) in crew"
          :key="'crew-' + i"
          :data="{
            id: item.id,
            name: item.name,
            profile_path: item.profile_path,
            attr:
              // @ts-ignore
              item.job || item.department || item.known_for_department || '-'
          }"
        />
      </OverflowBehavior>
    </div>
    <div v-else>
      <p class="text-center text-gray-500 dark:text-gray-400">No cast found</p>
    </div>
  </section>
</template>
