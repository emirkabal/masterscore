<script lang="ts" setup>
import debounce from "lodash.debounce"

const emits = defineEmits(["handle"])
const search = ref("")
const pending = ref(false)
const tab = ref(-1)

const smart = reactive({
  movies: [] as any,
  series: [] as any,
  type: "puhutv" as "generic" | "puhutv"
})

const currentId = ref()
const details = ref()
const episodes = ref<any[]>([])
const seasons = ref<any[]>([])

const detailedSeasons = reactive({
  data: {} as Record<
    string,
    {
      episodes: any[]
      hidden: boolean
      pending: boolean
    }
  >
})

const getDetails = async (attr: { id: number; name: string }) => {
  if (currentId.value === attr.id) {
    tab.value = 1
    return
  }
  pending.value = true
  tab.value = 1
  const search = await $fetch(`/api/search?q=${attr.name}`)
  if (search.tmdb.length) {
    const entertainment = search.tmdb[0]
    const data = await $fetch(`/api/tmdb/${entertainment.id}?type=${entertainment.media_type}`)
    details.value = data
    if (entertainment.media_type === "tv") {
      if (smart.type === "generic") {
        const eps = await $fetch(`https://api.emirkabal.com/v1/smartvideo/series/${attr.id}`)
        episodes.value = eps as any
      } else {
        const details = await $fetch<any>(
          `https://appservice.puhutv.com/service/serie/getSerieInformations?id=${attr.id}`
        )
        if (details[0].seasons) seasons.value = details[0].seasons
      }
    }
    currentId.value = attr.id
    console.log(attr.name, data)
  }
  pending.value = false
}

const handlePuhu = (id: number) => {
  // https://appservice.puhutv.com/api/seasons/747/episodes?v=2
  if (detailedSeasons.data[id]) {
    detailedSeasons.data[id].hidden = !detailedSeasons.data[id].hidden
    return
  }

  if (detailedSeasons.data[id]?.episodes?.length) return
  detailedSeasons.data[id] = {
    episodes: [],
    hidden: false,
    pending: true
  }

  $fetch(`https://appservice.puhutv.com/api/seasons/${id}/episodes?v=2`).then((data: any) => {
    detailedSeasons.data[id].episodes = data.data.episodes
    detailedSeasons.data[id].pending = false
  })
}

const playPuhuMedia = async (ep: any) => {
  // video_id

  const data = await $fetch<any>(
    `https://dygvideo.dygdigital.com/api/video_info?akamai=true&PublisherId=29&ReferenceId=${ep.video_id}&SecretKey=NtvApiSecret2014*`
  )

  const mediaUrl = data.data.flavors.hls
  const skipIntro = data.data.skipIntro
  console.log(mediaUrl)
  emits("handle", {
    mediaUrl,
    season: ep?.season || data.data?.season_number ? data.data?.season_number + 1 : 0,
    episode: ep?.episode || data.data?.episode_number || 0,
    skipIntro,
    ...details.value
  })
}

watch(
  () => smart.type,
  () => {
    smart.movies = []
    smart.series = []
    tab.value = -1
  }
)

watch(
  search,
  debounce(async () => {
    pending.value = true
    if (smart.type === "generic") {
      const movies = await $fetch(
        `https://api.emirkabal.com/v1/smartvideo/movies?q=${search.value}`
      )
      const series = await $fetch(
        `https://api.emirkabal.com/v1/smartvideo/series/search?q=${search.value}`
      )
      smart.movies = movies
      smart.series = series
    } else if (smart.type === "puhutv") {
      const { data } = (await $fetch(
        `https://appservice.puhutv.com/search/search?query=${search.value}&v=2&source=web`
      )) as any
      smart.movies = []
      smart.series = []
      data[0].data.forEach((el: any) => {
        if (el.type === "title_serie") {
          smart.series.push(el)
        } else {
          smart.movies.push(el)
        }
      })
    }
    tab.value = 0
    pending.value = false
  }, 300)
)
</script>
<template>
  <div>
    <div>
      <div class="mb-6 flex items-center justify-between">
        <div class="flex items-center gap-x-4">
          <h1 class="text-2xl font-bold tracking-wide">Entertainment Explorer</h1>
          <button
            v-if="tab > 0"
            @click="tab = 0"
            class="flex items-center gap-x-2 rounded-full bg-gray-800 px-3 py-1.5 text-sm"
          >
            <Icon name="ph:arrow-u-up-left" class="h-4 w-4 text-gray-400" />
            navigate back
          </button>
        </div>
        <div class="flex gap-x-2">
          <FormInput
            v-model="search"
            class="w-full max-w-xs"
            variant="general"
            icon="mdi:magnify"
            placeholder="Search entertainment"
            :loading="pending"
          />
          <button
            class="text-xs font-semibold text-gray-700"
            :class="{
              'text-white': smart.type === 'generic'
            }"
            @click="smart.type = 'generic'"
          >
            Generic
          </button>
          <button
            class="text-xs font-semibold text-gray-700"
            :class="{
              'text-white': smart.type === 'puhutv'
            }"
            @click="smart.type = 'puhutv'"
          >
            puhutv
          </button>
        </div>
      </div>
      <div
        v-if="tab === -1"
        class="flex h-24 w-full items-center justify-center rounded-3xl text-2xl font-semibold tracking-tight"
      >
        Search something
      </div>
      <div v-else-if="tab === 1">
        <div v-if="pending">
          <div class="flex items-center justify-center">
            <Icon name="mdi:loading" class="h-8 w-8 animate-spin text-gray-400" />
          </div>
        </div>
        <div v-else>
          <div class="flex items-start gap-4">
            <EntertainmentLargeCard
              :key="details.id"
              :show-verified="true"
              :data="{
                url: `${details.localData.type}/${details.id}`,
                title: $getTitle(details),
                poster: details.poster_path
              }"
            />
            <div class="w-full">
              <h1 class="mb-2 text-4xl font-semibold tracking-tight">
                {{ $getTitle(details) }}
              </h1>
              <p class="mb-4 line-clamp-4 text-sm">
                {{ details.overview }}
              </p>
              <button
                v-if="details.localData.type === 'movie'"
                @click="$emit('handle', { playlistId: currentId, ...details })"
                class="flex items-center gap-x-2 rounded-full bg-gradient-to-t from-blue-500 via-violet-600 to-blue-700 px-6 py-2 text-xl font-semibold tracking-tight hover:from-blue-400 hover:via-violet-600 hover:to-blue-700"
              >
                <Icon name="mdi:play" class="h-6 w-6 text-white" />
                Watch
              </button>
              <div
                v-else-if="details.localData.type === 'tv' && smart.type === 'generic'"
                v-for="ep in episodes"
                @click="
                  $emit('handle', {
                    playlistId: ep.id,
                    season: ep.season || 0,
                    episode: ep.episode || 0,
                    ...details
                  })
                "
                class="cursor-pointer rounded-full px-4 py-2 hover:bg-gray-900 focus:bg-gray-900 focus:outline-none"
              >
                <div class="flex min-w-0 items-center justify-between">
                  <div class="flex items-center gap-x-2">
                    <h3
                      class="line-clamp-1 flex-grow text-lg font-semibold tracking-tight text-gray-100"
                    >
                      Episode {{ ep.episode }} S: {{ ep.season === 0 ? "-" : ep.season }}
                    </h3>
                  </div>
                  <button>
                    <Icon name="mdi:play" class="h-6 w-6 text-white" />
                    Watch
                  </button>
                </div>
              </div>
              <div v-else>
                <div
                  v-for="season in seasons"
                  :key="season.id"
                  class="my-2 rounded bg-gray-800 px-4 py-2"
                  @click="handlePuhu(season.id)"
                >
                  <div class="flex w-full justify-between">
                    <span class="font-semibold">{{ season.name }}</span>
                    <span>
                      <Icon
                        name="mdi:chevron-down"
                        class="h-6 w-6 text-gray-400"
                        :class="{
                          '-rotate-90 transform': detailedSeasons.data[season.id]?.hidden
                        }"
                      />
                    </span>
                  </div>
                  <div>
                    <Icon
                      v-if="detailedSeasons.data[season.id]?.pending"
                      name="mdi:loading"
                      class="h-8 w-8 animate-spin text-gray-400"
                    />
                    <div
                      v-if="
                        detailedSeasons.data[season.id] &&
                        !detailedSeasons.data[season.id].pending &&
                        !detailedSeasons.data[season.id].hidden
                      "
                      v-for="ep in detailedSeasons.data[season.id].episodes"
                      :key="ep.id"
                      class="flex items-center justify-between rounded-lg px-4 py-2 transition-colors duration-75 hover:bg-gray-900"
                    >
                      <div class="flex gap-4">
                        <img :src="ep.image" alt="" class="h-24 rounded-lg" />
                        <div>
                          <h3 class="font-semibold">{{ ep.name }}</h3>
                          <p class="text-gray-400">{{ ep.meta.short_description }}</p>
                        </div>
                      </div>
                      <button
                        @click="playPuhuMedia(ep)"
                        class="ml-4 flex h-auto items-center gap-x-2 rounded-full bg-gradient-to-t from-blue-500 via-violet-600 to-blue-700 px-6 py-2 font-semibold tracking-tight hover:from-blue-400 hover:via-violet-600 hover:to-blue-700"
                      >
                        <Icon name="mdi:play" class="h-6 w-6 text-white" />
                        Watch
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="space-y-6" v-else-if="tab === 0">
        <div v-if="!smart.movies.length && !smart.series.length">
          <div class="flex flex-col items-center justify-center text-2xl font-semibold">
            <Icon name="mdi:emoticon-sad-outline" class="h-8 w-8 text-gray-400" />
            Not found
          </div>
        </div>
        <div class="space-y-2" v-if="smart.movies.length">
          <h2 class="text-xl font-semibold tracking-tight text-gray-300">Movies</h2>
          <div class="flex flex-col">
            <div
              v-for="movie in smart.movies"
              @click="getDetails({ id: movie.id, name: movie.name })"
              class="cursor-pointer rounded-full px-4 py-2 hover:bg-gray-900 focus:bg-gray-900 focus:outline-none"
            >
              <div class="flex min-w-0 items-center justify-between">
                <div class="flex items-center gap-x-2">
                  <h3
                    class="line-clamp-1 flex-grow text-lg font-semibold tracking-tight text-gray-100"
                  >
                    {{ movie.name }}
                  </h3>
                </div>
                <time
                  class="ml-2 flex-shrink-0 self-center py-1 text-xs font-semibold text-gray-500"
                  >{{ movie.year }}</time
                >
              </div>
            </div>
          </div>
        </div>
        <div class="space-y-2" v-if="smart.series.length">
          <h2 class="text-xl font-semibold tracking-tight text-gray-300">Series</h2>
          <div class="flex flex-col">
            <div
              v-for="serie in smart.series"
              @click="getDetails({ id: serie.id, name: serie.name })"
              class="cursor-pointer rounded-full px-4 py-2 hover:bg-gray-900 focus:bg-gray-900 focus:outline-none"
            >
              <div class="flex min-w-0 items-center justify-between">
                <div class="flex items-center gap-x-2">
                  <h3
                    class="line-clamp-1 flex-grow text-lg font-semibold tracking-tight text-gray-100"
                  >
                    {{ serie.name }}
                  </h3>
                </div>
                <time
                  class="ml-2 flex-shrink-0 self-center py-1 text-xs font-semibold text-gray-500"
                  >{{ serie.last_update }}</time
                >
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="mt-4 grid grid-cols-4 gap-5 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">
        <EntertainmentLargeCard
          class="cursor-pointer"
          v-for="entertainment in entertainments"
          @click="
            (e) => {
              e.stopPropagation()
            }
          "
          :key="entertainment.id"
          :show-verified="
            smart.movies.find((e: any) => e.year == entertainment.release_date?.split('-')[0])
              ? true
              : false
          "
          :data="{
            title: $getTitle(entertainment),
            poster: entertainment.poster_path,
            backdrop: entertainment.backdrop_path
          }"
        />
      </div> -->
    </div>
  </div>
</template>
