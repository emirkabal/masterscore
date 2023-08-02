<script setup lang="ts">
const { data } = defineProps<{
  data?: {
    id: number
    name: string
    backdrop_path: string
    poster_path: string
  }
  loading: boolean
}>()

const { data: collection, pending } = useLazyFetch(
  `/api/extra/collections/${data?.id}`
)
</script>
<template>
  <section>
    <h1
      class="my-4 border-l-4 border-green-600 pl-4 text-2xl font-bold tracking-wide"
    >
      Collection
    </h1>
    <div v-if="pending || !collection || !data || loading">
      <div class="flex gap-2 overflow-x-hidden">
        <div class="flex flex-col" v-for="i in 8" :key="i">
          <div
            class="skeleton-effect h-40 w-[100px] rounded bg-gray-300 dark:bg-zinc-800 md:h-[300px] md:w-[200px]"
          ></div>
        </div>
      </div>
    </div>
    <div v-else>
      <OverflowBehavior>
        <EntertainmentLargeCard
          v-for="(item, i) in collection.parts"
          :key="'collection-' + i"
          :data="{
            title: item.title || data.name,
            release_date: item.release_date || '0',
            url: `${item.media_type}/${item.id}`,
            poster: item.poster_path || data.poster_path,
            backdrop: item.backdrop_path || data.backdrop_path
          }"
        />
      </OverflowBehavior>
    </div>
  </section>
</template>
