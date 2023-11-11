<script setup lang="ts">
import type { IEntertainment, IReview } from "~/types"
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
    verified: boolean
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

const fetch = async () => {
  pagination.loading = true
  const data = await $fetch<CustomIncomingData[]>(
    `/api/activities?page=${pagination.page}&type=review,watchlist`
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
  <section>
    <button
      @click="reset"
      v-if="params.page !== '1' && activities.length === 10"
      class="fixed bottom-0 left-0 right-0 z-10 origin-center rounded bg-gray-200 px-2 py-1 font-semibold transition-colors hover:bg-gray-300 dark:bg-zinc-900 dark:hover:bg-zinc-800"
    >
      Reset Page
    </button>
    <div v-if="loading" class="flex items-start py-8" v-for="i in 8" :key="i">
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
        <div
          class="skeleton-effect mt-1 h-14 w-32 rounded bg-gray-300 dark:bg-zinc-800"
        ></div>
      </div>
    </div>
    <div
      v-else
      class="flex w-full items-start gap-4 border-b py-8 dark:border-zinc-900"
      v-for="(activity, i) in activities"
      v-intersection-observer="
        i === activities.length - 1 ? onIntersectionObserver : () => {}
      "
      :key="activity._id"
    >
      <NuxtLink :to="`/users/@${activity.author.username}`">
        <Avatar
          :username="activity.author.username"
          :avatar="activity.author.avatar"
          :square="activity.author.verified"
          class="h-10 w-10 flex-shrink-0 md:h-14 md:w-14"
        />
      </NuxtLink>
      <div class="-mt-1.5 flex w-full min-w-0 flex-col">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-1">
            <div class="flex items-center gap-x-1 font-semibold">
              <span class="line-clamp-1 break-all"
                >@{{ activity.author.username }}</span
              >
              <Icon
                v-if="activity.author.verified"
                name="material-symbols:verified-rounded"
                class="h-5 w-5 flex-shrink-0 text-yellow-500"
              />
            </div>
            <span
              class="flex-shrink-0 text-xs text-gray-500 dark:text-gray-300"
            >
              {{ $moment(activity.createdAt).locale($i18n.locale).fromNow() }}
            </span>
          </div>
        </div>
        <ReviewContent
          v-if="activity.review"
          :review="activity.review"
          :skip-info="true"
          class="-mt-0.5"
        />
        <EntertainmentCard
          :to="`/details/${activity.entertainment.type}/${activity.entertainment.id}`"
          :entertainment="activity.entertainment"
          :score="activity.review?.rating"
          :title="activity.type"
        />
      </div>
    </div>
    <div
      class="my-10 flex justify-center opacity-0"
      :class="{
        'opacity-100': pagination.loading && !pagination.finished && !loading
      }"
    >
      <Loader />
    </div>
  </section>
</template>
