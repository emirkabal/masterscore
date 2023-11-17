<script lang="ts" setup>
import type { TMDBData, Episode, Season } from "~/types"
const { $event } = useNuxtApp()

interface SeasonData {
  [key: string]: Season & {
    id: string | number
    show: boolean
    season_number: number
    episodes: Episode[]
  }
}

const props = defineProps<{
  data: TMDBData
  smartVideoData?: any
}>()

const seasonsComputed = computed(() => {
  return props.data.seasons ? props.data.seasons.filter((season) => season.season_number !== 0) : []
})

const watchFeatureAnalyzing = ref(false)
const watchFeatureAnalyzed = ref(false)
const seasonData = reactive<SeasonData>({
  ...Object.fromEntries(
    seasonsComputed.value.map((season) => [
      season.id,
      {
        ...season,
        show: false,
        season_number: season.season_number,
        episodes: []
      }
    ])
  )
})

const seasons = computed(() =>
  Object.values(seasonData)
    .sort((a, b) => a.season_number - b.season_number)
    .filter((e) => e.episode_count)
)

const totalEpisodes = computed(() => {
  return seasons.value.reduce((acc, season) => {
    return acc + season.episode_count
  }, 0)
})

const getActualEpisode = (season: number, episode: number) => {
  const episodesPerSeason = [0]
  seasons.value.forEach((season) => {
    episodesPerSeason.push(season.episode_count)
  })
  let totalEpisodes = 0

  for (let i = 1; i < season; i++) {
    totalEpisodes += episodesPerSeason[i]
  }

  let actualEpisode = totalEpisodes + episode

  return actualEpisode
}

const getSmartVideo = (season: number, episode: number) => {
  if (props.smartVideoData) {
    if (props.smartVideoData[0].season == 0) {
      const data = props.smartVideoData.find(
        (e: any) => e.episode == getActualEpisode(season, episode)
      )
      if (data) {
        return data.id
      }
    } else {
      const data = props.smartVideoData.find((e: any) => e.season == season && e.episode == episode)
      if (data) {
        return data.id
      }
    }
  }
  return null
}

const getSeason = async (key: string, season_number: number) => {
  const data = await $fetch(`/api/extra/season/${props.data.id}/${season_number}`)
  seasonData[key].episodes = data.episodes.map((episode: Episode) => {
    return {
      ...episode,
      smartVideoId: getSmartVideo(season_number, episode.episode_number)
    }
  })
}

const isWatchAvailable = (season: number, episode: number) => {
  if (watchFeatureAnalyzing.value) return false
  const ep = getActualEpisode(season, episode)
  return props.smartVideoData && ep <= props.smartVideoData.length && getSmartVideo(season, episode)
}

const isSeasonAvailable = (season: number) => {
  if (watchFeatureAnalyzing.value) return false
  return (
    (props.smartVideoData && props.smartVideoData.find((e: any) => e.season == season)) ||
    isWatchAvailable(season, 1)
  )
}

const watchSmartVideo = (episode: Episode) => {
  if (!episode.smartVideoId) {
    episode.smartVideoId = getSmartVideo(episode.season_number, episode.episode_number)
  }
  if (!episode.smartVideoId) return
  $event("entertainment:watch", [episode.smartVideoId, episode])
}

watch(seasonData, () => {
  Object.keys(seasonData).forEach((key) => {
    if (seasonData[key].show) {
      if (seasonData[key].episodes.length === 0) getSeason(key, seasonData[key].season_number)
      if (process.client) {
        const item = document.querySelector(`[aria-details="${key}"]`)
        if (item) {
          setTimeout(() => {
            window.scrollTo({
              top: item.getBoundingClientRect().top + window.scrollY - 120,
              behavior: seasonData[key].episodes.length === 0 ? "instant" : "smooth"
            })
          }, 10)
        }
      }
    }
  })
})

watch(
  () => props.smartVideoData,
  async () => {
    if (props.smartVideoData) {
      if (props.smartVideoData.length && props.smartVideoData.length !== totalEpisodes.value) {
        watchFeatureAnalyzing.value = true
        const data = await $fetch(`/api/extra/episode_groups/groups/${props.data.id}`)

        if (data && "results" in data) {
          const bestMatch = data.results.find(
            (epg) => epg.episode_count === props.smartVideoData.length
          )

          if (bestMatch) {
            const data = await $fetch(`/api/extra/episode_groups/details/${bestMatch.id}`)

            if (data && "groups" in data) {
              Object.keys(seasonData).forEach((key) => {
                delete seasonData[key]
              })

              data.groups.forEach((group) => {
                seasonData[group.id] = {
                  ...group,
                  show: false,
                  season_number: group.order,
                  episode_count: group.episodes.length,
                  overview: data.description,
                  air_date: group.episodes[0].air_date,
                  episodes: group.episodes.map((episode: Episode, i) => {
                    return {
                      ...episode,
                      episode_number: i + 1,
                      season_number: group.order,
                      smartVideoId: getSmartVideo(group.order, episode.episode_number)
                    }
                  })
                }
              })

              watchFeatureAnalyzed.value = true
            }
          }
        }

        watchFeatureAnalyzing.value = false
      }

      if (
        props.smartVideoData.length &&
        props.smartVideoData.length > 0 &&
        !watchFeatureAnalyzed.value
      ) {
        const watchableSeasons = props.smartVideoData
          .map((e: any) => e.season)
          .filter((e: any, i: any, a: any) => a.indexOf(e) === i)

        if (watchableSeasons.includes(0)) return

        watchableSeasons.forEach((season: any) => {
          const eps = props.smartVideoData.filter((e: any) => e.season == season).length

          if (
            eps >
            3 +
              (seasons.value.find((se) => se.season_number == season)?.episode_count ||
                seasons.value[0].episode_count)
          ) {
            $event("entertainment:watch-feature-mismatch")
          }
        })
      }
    }
  }
)
</script>

<template>
  <section>
    <div class="my-4 flex items-start justify-between border-l-4 border-green-500 pl-4">
      <span>
        <h1 class="text-2xl font-bold tracking-wide">
          {{ $t("entertainment.episodes") }}
        </h1>
        <p class="text-xs opacity-75">
          {{ $t("entertainment.total_episodes", { total: totalEpisodes }) }}
        </p>
      </span>

      <div v-if="watchFeatureAnalyzing" class="flex items-center gap-1 text-xs opacity-90">
        <Spinner class="-mr-2 scale-50" />
        Optimizing for watch feature...
      </div>
    </div>
    <div class="flex flex-col gap-2">
      <div
        :aria-details="item.id.toString()"
        v-for="item in seasons"
        :key="item.id"
        @click="
          () => {
            Object.keys(seasonData).forEach((key) => {
              if (key !== item.id.toString()) {
                seasonData[key].show = false
              }
            })
            seasonData[item.id].show = !seasonData[item.id].show
          }
        "
        class="cursor-pointer rounded border p-4 transition-colors duration-75"
        :class="{
          'border-gray-600 dark:border-gray-400': seasonData[item.id].show,
          'hover:border-gray-600 dark:border-gray-800 hover:dark:border-gray-400':
            !seasonData[item.id].show
        }"
      >
        <div
          class="flex min-w-0 select-none items-center gap-2"
          :class="{
            'h-0': seasonData[item.id].show
          }"
        >
          <span
            v-if="!seasonData[item.id].show && isSeasonAvailable(item.season_number)"
            class="flex-shrink-0"
            ><Icon name="ic:outline-play-arrow" class="h-6 w-6"
          /></span>
          <span
            v-if="!seasonData[item.id].show"
            class="max-w-xl truncate font-semibold md:text-lg"
            >{{ item.name }}</span
          >
          <span
            v-if="!seasonData[item.id].show"
            class="mr-auto flex-shrink-0 text-xs text-gray-400 dark:text-zinc-400 md:text-sm"
            >{{
              $t("entertainment.n_episodes", {
                n: item.episode_count
              })
            }}</span
          >
          <Icon
            name="ic:round-chevron-left"
            class="ml-auto h-6 w-6 flex-shrink-0 transition-transform md:h-8 md:w-8"
            :class="{
              'mt-6 rotate-[270deg]': seasonData[item.id].show,
              'rotate-180': !seasonData[item.id].show
            }"
          />
        </div>
        <div
          v-show="seasonData[item.id].show"
          class="flex flex-col items-center justify-center gap-4 md:flex-row md:items-start md:justify-start"
        >
          <MasterImage
            v-if="item.poster_path"
            :source="$timage(item.poster_path, 'w500')"
            class="h-36 w-24 rounded-md shadow-md"
          />
          <div class="w-full">
            <div class="cursor-text" @click="(e) => e.stopPropagation()">
              <div class="flex min-w-0 items-center gap-2">
                <span class="line-clamp-1 font-semibold md:text-xl">{{ item.name }}</span>
                <span
                  class="flex-shrink-0 text-xs text-gray-400 dark:text-zinc-400 md:mt-0.5 md:text-base"
                  >{{
                    $t("entertainment.n_episodes", {
                      n: item.episode_count
                    })
                  }}</span
                >
              </div>
              <p class="text-xs font-semibold opacity-75 md:text-base">
                {{ $moment(item.air_date).locale($i18n.locale).format("MMMM D, YYYY") }}
              </p>
              <p
                class="ml-auto line-clamp-4 cursor-text text-xs opacity-90 md:text-base md:leading-5"
              >
                {{ item.overview }}
              </p>
            </div>
            <div class="mt-4 w-full space-y-2" @click="(e) => e.stopPropagation()">
              <div v-if="seasonData[item.id].episodes.length === 0" class="my-6">
                <Spinner />
              </div>
              <div
                v-else
                v-for="episode in seasonData[item.id].episodes"
                :key="episode.id"
                @click="watchSmartVideo(episode)"
                class="flex cursor-pointer select-none items-center gap-2 rounded-lg p-2 transition-colors hover:bg-gray-200 hover:dark:bg-gray-900 md:gap-4"
              >
                <MasterImage
                  v-if="episode.still_path"
                  class="h-14 w-24 rounded-md shadow-md md:h-24 md:w-40"
                  :source="$timage(episode.still_path, 'w500')"
                />
                <div class="w-full">
                  <div class="flex min-w-0 items-center gap-2 font-semibold">
                    <span class="line-clamp-1 text-xs md:text-xl">{{ episode.name }}</span>
                    <span
                      class="flex-shrink-0 text-xs text-gray-400 dark:text-zinc-400 md:text-base"
                      >E-{{ episode.episode_number }}</span
                    >
                  </div>
                  <div class="flex gap-2 text-xs font-semibold opacity-75 md:text-base">
                    <p>
                      {{ $moment(episode.air_date).locale($i18n.locale).format("MMMM D, YYYY") }}
                    </p>
                    <p>
                      {{
                        $moment
                          .duration(episode.runtime, "minutes")
                          .locale($i18n.locale)
                          .format("h[h] m[m]")
                      }}
                    </p>
                  </div>
                  <p
                    class="ml-auto line-clamp-2 text-xs opacity-90 md:line-clamp-4 md:text-base md:leading-5"
                  >
                    {{ episode.overview }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
