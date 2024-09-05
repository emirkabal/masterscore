<script setup>
import { getHome } from "~/composables/request"
const { $listen } = useNuxtApp()
import { useUserStore } from "~/store/user"

const userStore = useUserStore()
const preferences = usePreferences()

useHead({
  title: "Masterscore",
  titleTemplate: "%s"
})

const {
  data: home,
  status,
  refresh
} = await useAsyncData(() => getHome(), {
  lazy: true
})

const top_rated = computed(() => {
  return home.value.top_rated.map((item) => {
    return {
      id: item.media.tmdb_id,
      media_type: item.media.type,
      title: item.media.title,
      poster_path: item.media.images.poster,
      backdrop_path: item.media.images.backdrop,
      vote_average: item.score
    }
  })
})

$listen("refresh:entertainment", () => {
  refresh()
})
</script>

<template>
  <div class="preffered-background">
    <div class="mx-auto max-w-[1600px] px-4 py-24 md:px-14">
      <div v-if="status === 'success'">
        <div class="h-[640px] w-full">
          <HomeMainSlider :data="home.trending" />
        </div>

        <div class="space-y-4 py-12">
          <div class="mb-6 flex h-10 items-center gap-x-6">
            <h3 class="text-2xl font-bold tracking-tight sm:text-4xl">
              {{ $t("home.top_rated") }}
            </h3>
            <NuxtLink to="/table" class="text-sm font-semibold text-gray-300 hover:text-white">
              {{ $t("see-all") }}
            </NuxtLink>
          </div>
          <EntertainmentSlider
            :data="top_rated"
            :fixed-media-type="'movie'"
            :item-size="'default'"
            :offset="0"
            :show-ratings="true"
          />
        </div>

        <div class="mt-8 flex flex-col gap-12 md:flex-row">
          <div class="h-full w-full">
            <h3 class="text-2xl font-bold tracking-tight sm:text-3xl">
              {{ $t("home.recent_highlights") }}
            </h3>
            <div class="mt-6 grid gap-8 sm:grid-cols-2">
              <HomeMediaCard
                v-for="hero in home.trending.slice(0, 20)"
                :key="hero.id"
                :to="$tlink(hero)"
                :poster="hero.poster_path"
                :title="$getTitle(hero)"
                :subtitle="$getYear(hero).toString()"
              />
            </div>
          </div>
          <div class="flex w-full flex-col justify-between gap-12">
            <div class="w-full">
              <h3 class="text-2xl font-bold tracking-tight sm:text-3xl">
                {{ $t("home.most_liked") }}
              </h3>
              <div class="mt-6 grid gap-6 sm:grid-cols-2">
                <HomeMediaCard
                  v-for="hero in home.top_liked"
                  :key="hero.data.id"
                  :to="$tlink(hero.data)"
                  :poster="hero.data.images.poster"
                  :title="hero.data.title"
                  :subtitle="$t('home.likes', [hero.count])"
                />
              </div>
            </div>
            <div class="w-full">
              <h3 class="text-2xl font-bold tracking-tight sm:text-3xl">
                {{ $t("home.most_commented") }}
              </h3>
              <div class="mt-6 grid gap-6 sm:grid-cols-2">
                <HomeMediaCard
                  v-for="hero in home.top_commented"
                  :key="hero.data.id"
                  :to="$tlink(hero.data)"
                  :poster="hero.data.images.poster"
                  :title="$getTitle(hero.data)"
                  :subtitle="$t('home.comments', [hero.count])"
                />
              </div>
            </div>
          </div>
        </div>

        <div
          class="relative my-24 flex items-center justify-between overflow-hidden rounded-3xl bg-fuchsia-500 bg-gradient-to-r from-fuchsia-800 from-25% px-16 py-24"
        >
          <div class="z-10 space-y-4">
            <h3 class="max-w-lg text-2xl font-bold leading-relaxed sm:text-3xl">
              {{ $t("home.hero_discover.title") }}
            </h3>
            <NuxtLink
              to="/discover"
              class="flex w-full items-center gap-2 rounded-xl bg-white px-4 py-2 text-lg font-semibold text-black transition-opacity hover:opacity-75 md:w-fit"
            >
              <Icon name="ic:round-explore" size="24" />
              {{ $t("discover.title") }}
            </NuxtLink>
          </div>
          <div
            class="pointer-events-none absolute inset-0 z-[5] bg-gradient-to-r from-fuchsia-500 via-fuchsia-600 via-35% to-transparent to-75%"
          ></div>
          <div class="absolute -right-96 top-6 hidden select-none md:block 2xl:-right-32">
            <div class="flex max-w-5xl flex-wrap gap-4">
              <MasterImage
                class="aspect-poster h-48 rounded-3xl"
                v-for="hero in home.trending.slice(0, 14)"
                :key="hero.id"
                :source="$timage(hero.poster_path, 'w154')"
              />
            </div>
          </div>
        </div>

        <div class="mt-8 flex flex-col gap-12 lg:flex-row">
          <div class="h-full w-full">
            <h3 class="text-2xl font-bold tracking-tight sm:text-3xl">
              {{ $t("home.users_most_commented") }}
            </h3>
            <div class="mt-6 grid gap-8 sm:grid-cols-2">
              <HomeUserCard
                v-for="user in home.users_most_commented.slice(0, 14)"
                :key="user.data.id"
                :to="`${user.data.username}`"
                :user="user.data"
                :subtitle="$t('home.comments', [user.count])"
              />
            </div>
          </div>
          <div class="flex w-full flex-col justify-between gap-12">
            <div class="w-full">
              <h3 class="text-2xl font-bold tracking-tight sm:text-3xl">
                {{ $t("home.users_most_masters") }}
              </h3>
              <div class="mt-6 grid gap-6 sm:grid-cols-2">
                <HomeUserCard
                  v-for="user in home.users_most_reviewed.slice(0, 6)"
                  :key="user.data.id"
                  :to="`${user.data.username}`"
                  :user="user.data"
                  :subtitle="$t('home.reviews', [user.count])"
                />
              </div>
            </div>
            <div class="w-full">
              <h3 class="text-2xl font-bold tracking-tight sm:text-3xl">
                {{ $t("home.users_most_liked") }}
              </h3>
              <div class="mt-6 grid gap-6 sm:grid-cols-2">
                <HomeUserCard
                  v-for="user in home.users_most_liked.slice(0, 6)"
                  :key="user.data.id"
                  :to="`${user.data.username}`"
                  :user="user.data"
                  :subtitle="$t('home.likes', [user.count])"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- join us -->
        <div
          v-if="!userStore.isLoggedIn"
          class="relative my-24 flex items-center justify-between overflow-hidden rounded-3xl bg-gradient-to-l from-yellow-500 from-25% to-yellow-800 px-16 py-24"
        >
          <div class="z-10 space-y-4">
            <h3 class="max-w-lg text-xl font-bold leading-relaxed sm:text-3xl">
              {{ $t("home.join_us") }}
            </h3>
            <NuxtLink
              to="/account/signup"
              class="flex w-full items-center gap-2 rounded-xl bg-white px-4 py-2 text-lg font-semibold text-black transition-opacity hover:opacity-75 md:w-fit"
            >
              <Icon name="ic:round-person-add" size="24" />
              {{ $t("guest.sign_up") }}
            </NuxtLink>
          </div>
          <div
            class="absolute -right-96 -top-8 hidden rotate-[8.85deg] select-none md:block 2xl:-right-32"
          >
            <div class="flex max-w-5xl flex-wrap gap-4">
              <Avatar
                class="aspect-square h-36 rounded-3xl"
                v-for="user in home.users_most_reviewed"
                :key="user.data.id"
                :username="user.data.username"
                :avatar="user.data.avatar"
              />
            </div>
          </div>
        </div>
      </div>

      <div v-else>
        <div class="skeleton-effect h-[640px] w-full rounded-3xl bg-gray-900"></div>

        <div class="mt-8 flex gap-6">
          <div class="skeleton-effect h-96 w-full rounded-3xl bg-gray-900"></div>
          <div class="skeleton-effect h-96 w-full rounded-3xl bg-gray-900"></div>
        </div>

        <div class="mt-8 flex gap-6">
          <div class="skeleton-effect h-96 w-full rounded-3xl bg-gray-900"></div>
          <div class="skeleton-effect h-96 w-full rounded-3xl bg-gray-900"></div>
        </div>
      </div>
    </div>
  </div>
</template>
