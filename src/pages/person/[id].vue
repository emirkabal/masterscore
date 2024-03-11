<script setup lang="ts">
import { useLocalStorage } from "@vueuse/core"
import type { CreditsResult } from "~/types"
const { params } = useRoute()
const { $moment, $listen } = useNuxtApp()
const { t, locale } = useI18n()
const revealBio = ref(false)
const showDetailsDev = ref(false)
const flags = useLocalStorage("preferences", {} as any)

const { data, pending, error, refresh } = await useAsyncData(
  `Person-${params.id}`,
  () => {
    return getPerson(params.id as string)
  },
  {
    lazy: true
  }
)

if (error.value) throw error.value

const name = computed(() => {
  return data.value?.name || "..."
})

const age = computed(() => {
  if (!data.value || "status" in data.value) return 0
  if (!data.value.deathday && data.value.birthday) {
    return $moment().locale(locale.value).diff(data.value.birthday, "years")
  } else if (data.value.deathday && data.value.birthday) {
    return $moment(data.value.deathday).locale(locale.value).diff(data.value.birthday, "years")
  } else {
    return 0
  }
})

const gender = computed(() => {
  if (!data.value || "status" in data.value) return 0
  return t(`person.genders.${data.value.gender}`)
})

const isBig = computed(() => {
  if (!data.value || "status" in data.value) return false
  return data.value.biography.length > 500
})

const getCrew = computed<Record<string, CreditsResult[]>>(() => {
  if (!data.value?.combined_credits?.crew?.length) return {}
  const group = data.value.combined_credits.crew.reduce((acc: any, movie: any) => {
    if (!acc[movie.department]) acc[movie.department] = []
    movie.year = (movie.release_date || movie.first_air_date)?.split("-")[0] || "—"
    acc[movie.department].push(movie)
    return acc
  }, {})

  group.Acting = data.value.combined_credits.cast
    .map((e: any) => {
      e.year = (e.release_date || e.first_air_date)?.split("-")[0] || "—"
      return e
    })
    .sort((a: any, b: any) => {
      if (!a.release_date && !a.first_air_date) return -1
      else if (a.release_date && b.release_date)
        return new Date(b.release_date).getTime() - new Date(a.release_date).getTime()
      else if (a.first_air_date && b.first_air_date)
        return new Date(b.first_air_date).getTime() - new Date(a.first_air_date).getTime()
      return 0
    })

  Object.keys(group).forEach((e) =>
    group[e].sort((a: any, b: any) => {
      if (a.year === "—") return -1
      return new Date(b.year).getTime() - new Date(a.year).getTime()
    })
  )

  return group
})

const departmentTitles = computed(() => {
  const group = getCrew.value
  const personDepartment = data.value?.known_for_department
  return Object.keys(group).sort((a, b) => {
    if (a === personDepartment) return -1
    else if (b === personDepartment) return 1
    else if (group[a].length > group[b].length) return -1
    else if (group[a].length < group[b].length) return 1
    return 0
  })
})

const knownFor = computed<CreditsResult[]>(() => {
  if (!data.value?.combined_credits?.cast?.length && !data.value?.combined_credits?.crew?.length)
    return []
  const sorted = [...data.value.combined_credits?.cast, ...data.value.combined_credits?.crew]
    .filter((movie, index, self) => self.findIndex((m) => m.id === movie.id) === index)
    .sort((a, b) => b.vote_count - a.vote_count)
    .slice(0, 9)
  return sorted
})

$listen("refresh:entertainment", () => {
  refresh()
})

useHead({
  title: name,
  titleTemplate: "%s | Masterscore"
})
</script>
<template>
  <div v-if="pending" class="flex items-center justify-center">
    <Loader class="my-36" />
  </div>
  <div v-else-if="!data || 'status' in data">
    <div class="flex h-96 flex-col items-center justify-center">
      <h1 class="text-4xl font-semibold">404</h1>
      <p class="text-xl">Person not found</p>
    </div>
  </div>

  <div v-else class="pb-36 pt-20">
    <div class="container mx-auto mt-8 px-4">
      <div class="flex flex-col items-stretch justify-center gap-8 md:flex-row">
        <div class="w-full md:min-w-[300px] md:max-w-[300px]">
          <MasterImage
            :source="$timage(data.profile_path || '-', 'w500')"
            class="mx-auto h-96 max-w-[300px] rounded-lg shadow-lg md:mx-0 md:h-[450px]"
          />
          <h1 class="mt-2 block text-center text-3xl font-bold tracking-wide md:hidden">
            {{ name }}
          </h1>
          <div class="text-center md:text-left">
            <div
              v-if="
                data.external_ids &&
                (data.external_ids.twitter_id || data.external_ids.instagram_id)
              "
              class="my-2 flex items-center justify-center gap-2 md:justify-start"
            >
              <a
                v-if="data.external_ids.twitter_id"
                :href="`https://twitter.com/${data.external_ids.twitter_id}`"
                target="_blank"
                rel="noopener noreferrer nofollow"
                class="transition-opacity hover:opacity-75"
                ><Icon name="line-md:twitter-x" class="h-8 w-8"
              /></a>
              <a
                v-if="data.external_ids.instagram_id"
                :href="`https://instagram.com/${data.external_ids.instagram_id}`"
                target="_blank"
                rel="noopener noreferrer nofollow"
                class="transition-opacity hover:opacity-75"
                ><Icon name="line-md:instagram" class="h-8 w-8"
              /></a>
            </div>
            <h2 class="mb-4 text-2xl font-semibold tracking-tighter">
              {{ $t("person.personal_info") }}
            </h2>
            <div class="personal space-y-2">
              <p v-if="data.known_for_department">
                <strong>{{ $t("person.known_for") }}</strong>
                {{ $t(`person.departments.${data.known_for_department}`) }}
              </p>
              <p v-if="data.gender">
                <strong>{{ $t("person.gender") }}</strong>
                {{ gender }}
              </p>
              <p v-if="data.birthday">
                <strong>{{ $t("person.birthday") }}</strong>
                {{ data.birthday }}
                {{ !data.deathday ? `(${$t("person.age", { n: age })})` : "" }}
              </p>
              <p v-if="data.deathday">
                <strong>{{ $t("person.deathday") }}</strong>
                {{ data.deathday }} ({{ $t("person.age", { n: age }) }})
              </p>
              <p v-if="data.place_of_birth">
                <strong>{{ $t("person.place_of_birth") }}</strong>
                {{ data.place_of_birth }}
              </p>
              <p v-if="data.also_known_as.length !== 0">
                <strong>{{ $t("person.also_known_as") }}</strong>
                {{ data.also_known_as.join(", ") }}
              </p>
            </div>
          </div>
        </div>
        <div class="min-w-0 max-w-4xl flex-1 space-y-6">
          <h1 class="hidden text-3xl font-bold tracking-wide md:block">
            {{ data.name }}
          </h1>
          <div class="space-y-2 text-center md:text-left">
            <h2 class="text-2xl font-bold tracking-wide">
              {{ $t("person.biography") }}
            </h2>
            <p class="relative whitespace-pre-wrap">
              <span
                :class="{
                  'line-clamp-6': isBig && !revealBio
                }"
              >
                {{ data.biography || $t("person.no_biography") }}
              </span>
              <button
                v-if="isBig && !revealBio"
                @click="revealBio = !revealBio"
                class="5 group absolute bottom-0 right-0 w-full bg-gradient-to-l from-gray-950 text-right"
              >
                <span class="font-semibold group-hover:opacity-75">{{
                  $t("person.read_more")
                }}</span>
              </button>
            </p>
          </div>
          <div v-if="knownFor" class="space-y-4 overflow-hidden">
            <h3 class="text-2xl font-bold tracking-wide">
              {{ $t("person.known_for") }}
            </h3>
            <EntertainmentSlider
              :data="knownFor"
              :fixed-media-type="'movie'"
              :item-size="'default'"
              :offset="0"
            />
            <div v-if="getCrew">
              <div v-for="(department, i) in departmentTitles" :key="i">
                <div class="mt-4" v-if="getCrew[department].length">
                  <h3 class="pb-2 text-2xl font-bold tracking-wide">
                    {{ $t(`person.departments.${department}`) }}
                  </h3>
                  <div class="flex flex-col gap-4 rounded-xl bg-gray-900 py-4">
                    <div
                      v-for="(movie, i) in getCrew[department]"
                      :key="i"
                      class="flex items-center gap-4 px-4"
                      :class="{
                        'border-t border-gray-700 pt-4':
                          getCrew[department][i - 1]?.year !== movie.year && i !== 0
                      }"
                    >
                      <div class="flex items-start gap-x-4">
                        <span class="mt-0.5 w-10 text-center font-maven">{{ movie.year }}</span>
                        <div>
                          <NuxtLink
                            :to="`/${movie.media_type}/${movie.id}`"
                            class="text-lg font-semibold text-white hover:text-gray-200"
                            >{{ movie.title || movie.name }}</NuxtLink
                          >
                          <p class="text-gray-400" v-if="movie.job || movie.character">
                            as <span class="text-white">{{ movie.job || movie.character }}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="flags.debug_mode">
            <button
              @click="showDetailsDev = !showDetailsDev"
              class="font-semibod mt-8 rounded bg-gray-900 px-4 py-2 shadow"
            >
              {{ showDetailsDev ? "Hide" : "Show" }} details
            </button>
            <div v-if="showDetailsDev">
              <p>Person: {{ params.id }}</p>
              <ClientOnly>
                <JsonViewer :value="data" copyable sort expanded theme="jsonviewer" />
              </ClientOnly>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.personal p strong {
  @apply block font-semibold;
}
.personal p {
  @apply block;
}
</style>
