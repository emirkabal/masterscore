<script setup lang="ts">
import { useStorage } from "@vueuse/core"
import { TMDBPerson } from "~~/src/@types"
const { params } = useRoute()
const { $moment } = useNuxtApp()
const revealBio = ref(false)
const showDetailsDev = ref(false)
const flag = useStorage("debugMode", false)
const {
  data,
  pending
}: {
  data: Ref<null | TMDBPerson>
  pending: Ref<boolean>
} = useFetch(`/api/person/details/${params.id}`)

const genders = ["Unknown", "Female", "Male", "Non-binary"]

const name = computed(() => {
  return data.value?.name || "..."
})

const age = computed(() => {
  if (!data.value || "status" in data.value) return 0
  if (!data.value.deathday && data.value.birthday) {
    return $moment().diff(data.value.birthday, "years")
  } else if (data.value.deathday && data.value.birthday) {
    return $moment(data.value.deathday).diff(data.value.birthday, "years")
  } else {
    return 0
  }
})

const gender = computed(() => {
  if (!data.value || "status" in data.value) return 0
  return genders[data.value.gender]
})

const isBig = computed(() => {
  if (!data.value || "status" in data.value) return false
  return data.value.biography.length > 500
})

useHead({
  title: name,
  titleTemplate: "%s - Masterscore"
})
</script>
<template>
  <div v-if="pending || !data">
    <Spinner />
  </div>
  <div v-else-if="'status' in data">
    <h1>Not found</h1>
  </div>
  <div v-else class="pb-36">
    <div class="container mx-auto mt-8 px-4">
      <div class="flex flex-col items-stretch justify-center gap-8 md:flex-row">
        <div class="w-full md:min-w-[300px] md:max-w-[300px]">
          <div
            v-if="!data.profile_path"
            class="mx-auto mb-2 flex h-[450px] max-h-[450px] w-full max-w-[300px] items-center justify-center rounded-lg bg-gray-700 font-maven font-semibold !text-white shadow-lg md:mx-0"
          >
            No Image
          </div>
          <img
            v-else
            :src="`https://www.themoviedb.org/t/p/w300_and_h450_bestv2/${data.profile_path}`"
            draggable="false"
            alt="profile picture"
            loading="lazy"
            class="mx-auto mb-2 h-full max-h-[450px] w-full max-w-[300px] rounded-lg shadow-lg md:mx-0"
          />
          <h1
            class="mt-2 block text-center font-maven text-3xl font-bold tracking-wide md:hidden"
          >
            {{ name }}
          </h1>
          <div class="text-center md:text-left">
            <div
              v-if="data.twitter_id || data.instagram_id"
              class="my-2 flex items-center justify-center gap-2 md:justify-start"
            >
              <a
                v-if="data.twitter_id"
                :href="`https://twitter.com/${data.twitter_id}`"
                target="_blank"
                class="transition-opacity hover:opacity-75"
                ><IconsTwitter class="h-8 w-8"
              /></a>
              <a
                v-if="data.instagram_id"
                :href="`https://instagram.com/${data.instagram_id}`"
                target="_blank"
                class="transition-opacity hover:opacity-75"
                ><IconsInstagram class="h-8 w-8"
              /></a>
            </div>
            <h2 class="mb-4 text-2xl font-semibold tracking-tighter">
              Personal Info
            </h2>
            <div class="personal space-y-2">
              <p v-if="data.known_for_department">
                <strong>Known For</strong>
                {{ data.known_for_department }}
              </p>
              <p v-if="data.gender">
                <strong>Gender</strong>
                {{ gender }}
              </p>
              <p v-if="data.birthday">
                <strong>Birthday</strong>
                {{ data.birthday }}
                {{ !data.deathday ? `(${age} years old)` : "" }}
              </p>
              <p v-if="data.deathday">
                <strong>Day of Death</strong>
                {{ data.deathday }} ({{ age }} years old)
              </p>
              <p v-if="data.place_of_birth">
                <strong>Place of Birth</strong>
                {{ data.place_of_birth }}
              </p>
              <p v-if="data.also_known_as.length !== 0">
                <strong>Also known as</strong>
                {{ data.also_known_as.join(", ") }}
              </p>
            </div>
          </div>
        </div>
        <div class="min-w-0 max-w-4xl flex-1 space-y-6">
          <h1
            class="hidden font-maven text-3xl font-bold tracking-wide md:block"
          >
            {{ data.name }}
          </h1>
          <div class="space-y-2 text-center md:text-left">
            <h1 class="font-maven text-2xl font-bold tracking-wide">
              Biography
            </h1>
            <p class="relative whitespace-pre-wrap">
              <span
                :class="{
                  'line-clamp-6': isBig && !revealBio
                }"
              >
                {{ data.biography || "There is no biography here..." }}
              </span>
              <button
                v-if="isBig && !revealBio"
                @click="revealBio = !revealBio"
                class="bg-gradi 5 group absolute right-0 bottom-0 w-full bg-gradient-to-l from-white text-right dark:from-black"
              >
                <span class="font-semibold group-hover:opacity-75"
                  >Read more...</span
                >
              </button>
            </p>
          </div>
          <div
            v-if="data.credits && data.credits.length > 0"
            class="space-y-4 overflow-hidden"
          >
            <h1 class="font-maven text-2xl font-bold tracking-wide">
              Known For
            </h1>
            <OverflowBehavior>
              <NuxtLink
                class="flex w-full max-w-[140px] flex-shrink-0 select-none flex-col transition-opacity hover:opacity-75 md:max-w-[160px]"
                v-for="media in data.credits"
                :key="media.id"
                :to="`/details/${media.media_type}/${media.id}`"
              >
                <div
                  class="flex w-full flex-col items-center justify-center rounded"
                >
                  <div
                    v-if="media.poster_path"
                    :style="{
                      backgroundImage: `url(https://image.tmdb.org/t/p/w500${media.poster_path})`
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
                    <p class="break-words font-semibold line-clamp-2">
                      {{ $getTitle(media) }}
                    </p>
                    <p class="lineclamp-1 break-words">
                      {{ media.character }}
                    </p>
                  </div>
                </div>
              </NuxtLink>
            </OverflowBehavior>
          </div>

          <div v-if="flag">
            <button
              @click="showDetailsDev = !showDetailsDev"
              class="font-semibod mt-8 rounded bg-white px-4 py-2 shadow dark:bg-zinc-900"
            >
              {{ showDetailsDev ? "Hide" : "Show" }} details
            </button>
            <div v-if="showDetailsDev">
              <p>Person: {{ params.id }}</p>
              <JsonViewer
                :value="data"
                copyable
                sort
                expanded
                theme="jsonviewer"
              />
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
  @apply block font-maven;
}
</style>
