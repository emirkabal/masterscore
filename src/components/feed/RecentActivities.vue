<script setup lang="ts">
import { useUrlSearchParams } from "@vueuse/core"
import { vIntersectionObserver } from "@vueuse/components"
import debounce from "lodash.debounce"
import type { Media } from "~/types"
const params = useUrlSearchParams("history")
const { $moment, $tlink } = useNuxtApp()

type CustomIncomingData = {
  id: string
  user: {
    display_name?: string
    username: string
    avatar: any
    verified: boolean
    flags: number
  }
  media: Media
  created_at: string
} & ({ type: "review"; content: string; rating: number } | { type: "like" })

const loading = ref(true)
const activities = ref<CustomIncomingData[]>([])
const pagination = reactive({
  finished: false,
  loading: false,
  page: params.page ? Number(params.page) : 1
})

const fetch = async () => {
  pagination.loading = true
  const data = await $fetch<CustomIncomingData[]>(`/api/feed/combined?page=${pagination.page}`)
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
  <section class="px-4">
    <button
      @click="reset"
      v-if="params.page !== '1' && activities.length === 10"
      class="fixed bottom-0 left-0 right-0 z-10 origin-center rounded bg-gray-900 px-2 py-1 font-semibold transition-colors hover:bg-gray-800"
    >
      Reset Page
    </button>
    <div v-if="loading" class="flex items-start py-8" v-for="i in 8" :key="i">
      <div
        class="skeleton-effect h-10 w-10 flex-shrink-0 rounded-full bg-gray-900 md:h-14 md:w-14"
      ></div>
      <div class="ml-4 flex w-full flex-col">
        <div class="skeleton-effect h-2 w-1/4 rounded bg-gray-900"></div>
        <div class="skeleton-effect mt-1 h-2 w-1/2 rounded bg-gray-900"></div>
        <div class="skeleton-effect mt-1 h-2 w-1/3 rounded bg-gray-900"></div>
        <div class="skeleton-effect mt-1 h-2 w-1/4 rounded bg-gray-900"></div>
        <div class="skeleton-effect mt-1 h-14 w-32 rounded bg-gray-900"></div>
      </div>
    </div>
    <div
      v-else
      class="flex w-full items-start gap-4 border-b border-gray-900 py-8"
      v-for="(activity, i) in activities"
      :key="activity.id"
    >
      <NuxtLink :to="`/${activity.user.username}`">
        <Avatar
          :username="activity.user.username"
          :avatar="activity.user.avatar"
          :square="activity.user.verified"
          class="h-10 w-10 flex-shrink-0 md:h-14 md:w-14"
        />
      </NuxtLink>
      <div class="flex w-full min-w-0 flex-col">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-1">
            <NuxtLink
              :to="`/${activity.user.username}`"
              class="flex items-center gap-x-1 font-semibold"
            >
              <span class="line-clamp-1 break-all">{{
                activity.user.display_name ?? activity.user.username
              }}</span>
              <Icon
                v-if="activity.user.verified"
                name="material-symbols:verified-rounded"
                class="h-5 w-5 flex-shrink-0 text-brand"
              />
              <Logo
                :small="true"
                v-if="activity.user.flags === 1"
                class="h-4 w-4 flex-shrink-0 text-brand"
              />
            </NuxtLink>
            <span
              v-tooltip="{
                content: $moment(activity.created_at).locale($i18n.locale).format('LLLL')
              }"
              class="flex-shrink-0 cursor-default text-xs text-gray-300"
            >
              {{ $moment(activity.created_at).locale($i18n.locale).calendar() }}
            </span>
          </div>
        </div>
        <EntertainmentDetailsReviewsContent
          v-if="activity.type === 'review'"
          :review="activity"
          :skip-info="true"
        />
        <EntertainmentCard
          :to="$tlink(activity.media)"
          :media="activity.media"
          :score="activity.type === 'review' ? activity.rating : undefined"
          :title="activity.type"
        />
      </div>
    </div>
    <div class="h-1 w-1" v-intersection-observer="onIntersectionObserver"></div>
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
