<script setup lang="ts">
import { IEntertainment, IReview } from "~/@types"
import { useUrlSearchParams } from "@vueuse/core"
import { vIntersectionObserver } from "@vueuse/components"
import debounce from "lodash.debounce"
const params = useUrlSearchParams("history")

interface CustomIncomingData {
  _id: string
  type: "review" | "like" | "watchlist"
  entertainment: IEntertainment
  review?: IReview
  attribute?: any
  author: {
    username: string
    avatar?: string
  }
  createdAt: Date
  updatedAt: Date
}

const loading = ref(true)
const activities = ref<CustomIncomingData[]>([])
const pagination = reactive({
  finished: false,
  loading: false,
  page: params.page ? Number(params.page) : 1
})

const strings: Record<string, string> = {
  review: "Reviewed",
  like: "Recommended",
  watchlist: "Added to watchlist"
}

const getActivityTitle = (type: string) => {
  return strings[type] || "Unknown"
}

const fetch = async () => {
  pagination.loading = true
  const data = await $fetch<CustomIncomingData[]>(
    `/api/activities?page=${pagination.page}`
  )
  activities.value = [...activities.value, ...data]
  pagination.loading = false
  loading.value = false
  params.page = pagination.page.toString()
  pagination.page++
  if (data.length < 10) {
    pagination.finished = true
  }
}

const reset = () => {
  loading.value = true
  activities.value = []
  pagination.page = 1
  pagination.finished = false
  fetch()
}

fetch()

const isVisible = ref(false)

function onIntersectionObserver([{ isIntersecting }]: any) {
  isVisible.value = isIntersecting
}

watch(
  isVisible,
  debounce(async (value) => {
    if (value && !pagination.loading && !pagination.finished) {
      fetch()
    }
  }, 350)
)
</script>
<template>
  <div>
    <div class="mb-4 flex justify-between">
      <h1
        id="top"
        class="border-l-4 border-blue-500 pl-2 text-2xl font-bold tracking-wide"
      >
        Recent Activities
      </h1>
      <button
        @click="reset"
        v-if="params.page !== '1' && activities.length === 10"
        class="z-10 rounded bg-zinc-900 px-2 py-1 transition-colors hover:bg-zinc-800"
      >
        Reset Page
      </button>
    </div>
    <div v-if="loading">
      <div class="flex items-center px-4 py-6" v-for="i in 8" :key="i">
        <div
          class="skeleton-effect h-10 w-10 flex-shrink-0 rounded-full bg-gray-300 dark:bg-zinc-800 md:h-14 md:w-14"
        ></div>
        <div class="ml-4 flex w-full flex-col">
          <div
            class="skeleton-effect h-2 w-1/4 rounded bg-gray-300 dark:bg-zinc-800"
          ></div>
          <div
            class="skeleton-effect mt-1 h-2 w-1/2 rounded bg-gray-300 dark:bg-zinc-800"
          ></div>
          <div
            class="skeleton-effect mt-1 h-2 w-1/3 rounded bg-gray-300 dark:bg-zinc-800"
          ></div>
          <div
            class="skeleton-effect mt-1 h-2 w-1/4 rounded bg-gray-300 dark:bg-zinc-800"
          ></div>
        </div>
      </div>
    </div>
    <div v-else>
      <div
        class="flex border-b px-4 py-6 dark:border-zinc-900"
        v-for="(activity, i) in activities"
        v-intersection-observer="
          i === activities.length - 1 ? onIntersectionObserver : () => {}
        "
        :key="activity._id"
      >
        <div
          class="flex w-full items-center gap-4"
          :class="{
            '!items-start': activity.review && activity.review.content
          }"
        >
          <NuxtLink
            :to="`/users/@${activity.author.username}`"
            class="font-bold hover:underline"
            ><Avatar
              :username="activity.author.username"
              :avatar="activity.author.avatar"
              class="h-10 w-10 flex-shrink-0 md:h-14 md:w-14"
          /></NuxtLink>
          <div class="flex w-full min-w-0 flex-col">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <NuxtLink
                  :to="`/users/@${activity.author.username}`"
                  class="line-clamp-1 font-bold hover:underline"
                  >@{{ activity.author.username }}</NuxtLink
                >
                <span
                  class="hidden text-xs text-gray-500 dark:text-gray-300 sm:block"
                >
                  {{ $moment(activity.createdAt).fromNow() }}
                </span>
              </div>

              <div class="z-10 flex items-center gap-1">
                <span v-if="activity.review" class="text-sm font-semibold">{{
                  activity.review.rating
                }}</span>
                <IconsThumbUpFilled
                  v-if="activity?.type === 'like'"
                  class="h-6 w-6 text-cyan-500"
                />
                <IconsListAdd
                  v-else-if="activity?.type === 'watchlist'"
                  class="text-black-600 h-6 w-6"
                />
                <IconsStarFilled v-else class="h-4 w-4 text-yellow-400" />
              </div>
            </div>
            <NuxtLink
              :to="`/details/${activity.entertainment.type}/${activity.entertainment.id}`"
              class="group -mt-1 flex w-fit items-center gap-1 text-xs"
            >
              <div
                class="z-10 line-clamp-1 flex w-full min-w-0 text-sm leading-4 md:text-base"
              >
                <span class="mr-1 flex-shrink-0">
                  {{ getActivityTitle(activity.type) }}:
                </span>
                <span
                  class="line-clamp-1 w-full break-all font-bold group-hover:underline"
                  >{{ activity.entertainment.info.title }}</span
                >
              </div>
            </NuxtLink>
            <ReviewContent v-if="activity.review" :review="activity.review" />
            <span
              class="block text-xs text-gray-500 dark:text-gray-300 sm:hidden"
            >
              {{ $moment(activity.createdAt).fromNow() }}
            </span>
          </div>
        </div>
      </div>
      <div
        class="my-10 flex justify-center opacity-0"
        :class="{
          'opacity-100': pagination.loading && !pagination.finished && !loading
        }"
      >
        <Spinner color="#000" />
      </div>
    </div>
  </div>
</template>
