<script setup lang="ts">
const { type, id, loading } = defineProps<{
  type?: string
  id?: string | number
  loading?: boolean
}>()

const { data, pending } = useLazyFetch(`/api/extra/similar/${type}/${id}`)

const similar = computed(() => {
  if (!data.value || !data.value.results) return []
  return data.value.results.filter((e) => e.poster_path)
})

const getName = computed(() => {
  if (type === "tv") return "TV Shows"
  else return "Movies"
})
</script>
<template>
  <section v-if="pending || loading || similar.length > 0">
    <h1
      class="my-4 border-l-4 border-pink-600 pl-4 text-2xl font-bold tracking-wide"
    >
      Similar {{ getName }}
    </h1>
    <div v-if="pending || !data || loading">
      <div class="flex gap-2 overflow-x-hidden">
        <div class="flex flex-col" v-for="i in 8" :key="i">
          <div
            class="skeleton-effect h-40 w-[100px] rounded bg-gray-300 dark:bg-zinc-800 md:h-[300px] md:w-[200px]"
          ></div>
        </div>
      </div>
    </div>
    <div v-else-if="similar.length > 0">
      <OverflowBehavior>
        <EntertainmentLargeCard
          v-for="(item, i) in similar"
          :key="'similar-' + i"
          :data="{
            title: item.title || 'Untitled',
            release_date: item.release_date || '0',
            url: `${type}/${item.id}`,
            poster: item.poster_path || '-',
            backdrop: item.backdrop_path || '-'
          }"
        />
      </OverflowBehavior>
    </div>
  </section>
</template>
