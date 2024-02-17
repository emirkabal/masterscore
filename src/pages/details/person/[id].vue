<script setup lang="ts">
import { useStorage } from "@vueuse/core"
import type { CreditsResult, TMDBPerson } from "~/types"
const { params } = useRoute()
const { $moment, $listen } = useNuxtApp()
const { t, locale } = useI18n()
const revealBio = ref(false)
const showDetailsDev = ref(false)
const flag = useStorage("debugMode", false)
const { data, pending, refresh } = useLazyFetch<null | TMDBPerson>(
  `/api/person/details/${params.id}`
)

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

const getCrew = computed(() => {
  if (!data.value?.combined_credits?.crew?.length) return null
  return data.value.combined_credits.crew
    .reduce((acc: CreditsResult[], curr) => {
      const found = acc.find((e) => e.id === curr.id)
      if (found) {
        found.job = `${found.job}, ${curr.job}`
      } else {
        acc.push(curr)
      }
      return acc
    }, [])
    .sort(
      (a, b) =>
        new Date(b.release_date || b.first_air_date).getTime() -
        new Date(a.release_date || b.first_air_date).getTime()
    )
})

const knownFor = computed<CreditsResult[]>(() => {
  if (!data.value?.combined_credits?.cast?.length) return []
  return data.value.combined_credits.cast

    .filter(
      (e) =>
        e.character !== "Himself" &&
        e.character !== "Herself" &&
        e.character !== "Self" &&
        e.character !== ""
    )
    .sort((a, b) => {
      if (a.order) return a.order - b.order
      else return b.vote_count - a.vote_count
    })
    .slice(0, 9)
})

$listen("refresh:entertainment", () => {
  refresh()
})

useHead({
  title: name,
  titleTemplate: "%s - Masterscore"
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
                <strong>{{ $t("deathday") }}</strong>
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
            <h1 class="text-2xl font-bold tracking-wide">
              {{ $t("person.biography") }}
            </h1>
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
                class="bg-gradi 5 group absolute bottom-0 right-0 w-full bg-gradient-to-l from-white text-right dark:from-black"
              >
                <span class="font-semibold group-hover:opacity-75">{{
                  $t("person.read_more")
                }}</span>
              </button>
            </p>
          </div>
          <div v-if="data.combined_credits?.cast?.length" class="space-y-4 overflow-hidden">
            <h1 class="text-2xl font-bold tracking-wide">
              {{ $t("person.known_for") }}
            </h1>
            <EntertainmentSlider
              :data="knownFor"
              :fixed-media-type="'movie'"
              :item-size="'default'"
              :offset="0"
            />
            <div class="flex flex-col gap-2" v-if="getCrew">
              <h2 class="text-center text-xl font-semibold tracking-tight md:text-left">
                {{ $t("person.detailed-job-history") }}
                <span class="text-gray-400">({{ getCrew.length }})</span>
              </h2>
              <NuxtLink
                v-for="crew in getCrew"
                class="rounded-full px-4 py-2 hover:bg-gray-900 focus:bg-gray-900 focus:outline-none"
                :to="`/details/${crew.media_type}/${crew.id}`"
              >
                <div class="flex min-w-0 items-center justify-between">
                  <div class="flex items-center gap-x-2">
                    <h3
                      class="line-clamp-1 flex-grow text-lg font-semibold tracking-tight text-gray-100"
                    >
                      {{ crew.title || crew.name }}
                    </h3>
                    <span class="h-0.5 w-3 self-center border border-gray-700"></span>
                    <h4 class="line-clamp-1 text-gray-400">
                      {{ crew.job }}
                    </h4>
                  </div>
                  <time
                    class="ml-2 flex-shrink-0 self-center py-1 text-xs font-semibold text-gray-500"
                    v-tooltip="{
                      content: $moment(new Date(crew.release_date || crew.first_air_date))
                        .locale($i18n.locale)
                        .format('LL')
                    }"
                    >{{
                      $moment(new Date(crew.release_date || crew.first_air_date))
                        .locale($i18n.locale)
                        .fromNow()
                    }}</time
                  >
                </div>
              </NuxtLink>
            </div>
          </div>

          <div v-if="flag">
            <button
              @click="showDetailsDev = !showDetailsDev"
              class="font-semibod mt-8 rounded bg-white px-4 py-2 shadow dark:bg-gray-900"
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
