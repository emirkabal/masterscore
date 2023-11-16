<script setup lang="ts">
import { SwiperSlide } from "swiper/vue"
import type { CreditsResult } from "~/types"

const { data, loading } = defineProps<{
  data?: {
    cast: CreditsResult[]
    crew: CreditsResult[]
  }
  loading?: boolean
}>()

const allModal = ref(false)

const crew = computed(() => {
  if (!data) return []
  let crewData = []

  for (const c of data.crew) {
    crewData.push({
      title: c.department,
      items: [] as CreditsResult[]
    })
  }

  crewData = crewData.filter(
    (v, i, a) => a.findIndex((t) => t.title === v.title) === i
  )

  for (const c of data.crew) {
    for (const i of crewData) {
      if (i.title === c.department && c.profile_path) {
        i.items.push(c)
      }
    }
  }

  crewData = crewData.filter((c) => c.items.length > 0)

  crewData = crewData.sort((a, b) => {
    // directing top
    if (a.title === "Directing") return -1
    if (b.title === "Directing") return 1
    if (a.title === "Writing") return -1
    if (b.title === "Writing") return 1

    return 0
  })

  return crewData
})

const cast = computed(() => {
  if (!data) return []
  return data.cast.filter((c) => c.profile_path)
})
</script>
<template>
  <section class="overflow-hidden">
    <h1
      v-if="cast.length > 0 || crew.length > 0"
      class="my-4 border-l-4 border-blue-700 pl-4 text-2xl font-bold tracking-wide"
    >
      {{ $t("entertainment.cast") }}
    </h1>
    <div v-if="loading || !data" class="space-y-2">
      <div
        class="skeleton-effect my-2 h-6 w-32 rounded bg-gray-300 dark:bg-gray-900"
      ></div>
      <div class="flex gap-2 overflow-x-hidden">
        <div class="flex flex-col" v-for="i in 8" :key="i">
          <div
            class="skeleton-effect h-32 w-[100px] rounded bg-gray-300 dark:bg-gray-900 md:h-[240px] md:w-[140px]"
          ></div>
          <div
            class="skeleton-effect mt-2 h-2 w-4/5 self-center rounded-full bg-gray-300 dark:bg-gray-900"
          ></div>
          <div
            class="skeleton-effect mt-2 h-2 w-3/4 self-center rounded-full bg-gray-300 dark:bg-gray-900"
          ></div>
        </div>
      </div>
    </div>
    <div v-else-if="cast.length > 0 || crew.length > 0" class="space-y-2">
      <EntertainmentSlider v-if="cast.length > 0">
        <SwiperSlide v-for="(item, i) in cast" :key="'cast-' + i">
          <PersonCard
            :data="{
              id: item.id,
              name: item.name,
              profile_path: item.profile_path,
              attr: item.character
            }"
          />
        </SwiperSlide>
      </EntertainmentSlider>
      <div v-if="crew.length > 0">
        <button @click="allModal = true" class="my-2 text-lg opacity-90">
          Show more..
        </button>
        <ScreenModal :modal="allModal" @close="allModal = false">
          <div
            class="h-full max-h-[550px] w-full max-w-[1200px] overflow-hidden rounded-xl bg-gray-200 p-2 dark:bg-gray-900 md:max-h-[780px] md:p-4"
          >
            <div class="h-full max-h-[780px] overflow-auto">
              <div v-for="(item, i) in crew" :key="'crew-' + i">
                <h1 class="my-2 text-xl font-bold tracking-wide md:text-2xl">
                  {{ item.title }}
                </h1>
                <div class="flex flex-row flex-wrap gap-y-6 md:gap-2">
                  <PersonCard
                    v-for="(c, i) in item.items"
                    :key="i"
                    :data="{
                      id: c.id,
                      name: c.name,
                      profile_path: c.profile_path,
                      attr: ''
                    }"
                  />
                </div>
              </div>
            </div>
          </div>
        </ScreenModal>
      </div>
    </div>
    <div v-else>
      <p class="text-center text-gray-500 dark:text-gray-400">No cast found</p>
    </div>
  </section>
</template>
