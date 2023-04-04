<script setup lang="ts">
const { type, id, loading } = defineProps<{
  type?: string
  id?: number | string
  loading?: boolean
}>()
// what am i doing right now?
const result = ref<any | null>(null)
const pend = ref(true)
onMounted(async () => {
  if (!loading) {
    pend.value = true
    const data = await $fetch<{
      data: any
    }>(`/api/extra/credits/${id}?type=${type}`)
    result.value = data
    pend.value = false
  }
})
</script>
<template>
  <div class="overflow-hidden">
    <h1
      class="my-4 border-l-4 border-blue-700 pl-4 text-2xl font-bold tracking-wide"
    >
      Cast
    </h1>
    <div v-if="pend || loading" class="flex gap-2 overflow-x-hidden">
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
    <OverflowBehavior
      v-else-if="
        result &&
        !loading &&
        !pend &&
        (result.cast.length > 0 || result.crew.length > 0)
      "
    >
      <NuxtLink
        class="flex w-full max-w-[140px] flex-shrink-0 select-none flex-col transition-opacity hover:opacity-75 md:max-w-[160px]"
        v-for="cast in result.cast.length > 0 ? result.cast : result.crew"
        :key="cast.id"
        :to="`/details/person/${cast.id}`"
      >
        <div class="flex w-full flex-col items-center justify-center rounded">
          <div
            v-if="cast.profile_path"
            :style="{
              backgroundImage: `url(https://image.tmdb.org/t/p/w500${cast.profile_path})`
            }"
            class="h-64 w-full flex-shrink-0 rounded bg-white bg-cover bg-center bg-no-repeat dark:bg-black"
          ></div>
          <div
            v-else
            class="flex h-64 w-full flex-shrink-0 items-center justify-center rounded bg-gray-800 font-semibold !text-white"
          >
            No Image
          </div>

          <div
            class="mt-2 flex h-full w-full flex-col items-center justify-center py-2 text-center font-maven"
          >
            <p class="line-clamp-2 break-words font-semibold">
              {{ cast.name }}
            </p>
            <p class="lineclamp-1 break-words">
              {{ cast.character }}
            </p>
          </div>
        </div>
      </NuxtLink>
    </OverflowBehavior>
    <div v-else>
      <p class="text-center text-gray-500 dark:text-gray-400">
        No cast/crew found
      </p>
    </div>
  </div>
</template>
