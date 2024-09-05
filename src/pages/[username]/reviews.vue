<script lang="ts" setup>
import type { Review } from "~/types"
import { vIntersectionObserver } from "@vueuse/components"
import { useUserStore } from "~/store/user"

const { $event, $timage, $tlink } = useNuxtApp()
const userStore = useUserStore()
const route = useRoute()

const username = computed(() => route.params.username as string)

const user = await getUser(username.value)

if (!user)
  throw createError({
    statusCode: 404,
    message: "User not found"
  })

const isMe = computed(() => user.id === userStore.user?.id)

const reviews = reactive({
  page: 1,
  finished: false,
  pending: false,
  data: [] as Review[],
  selected: null as Review | null,
  filter: {
    sort: route.query.sort ? (route.query.sort as string) : "created_at-desc",
    hasContent: false
  }
})

const fetchReviews = async () => {
  if (reviews.finished || reviews.pending) return

  reviews.pending = true

  const data = await $fetch<Review[]>(
    `/api/users/${user.username}/reviews?page=${reviews.page}&limit=20&sort_key=${reviews.filter.sort.split("-")[0]}&sort_by=${reviews.filter.sort.split("-")[1]}&content=${reviews.filter.hasContent ? "1" : "0"}`
  )
  reviews.data = [...reviews.data, ...data]

  if (data.length < 20) reviews.finished = true

  reviews.page++
  reviews.pending = false
}

fetchReviews()

function onIntersectionObserver([{ isIntersecting }]: any) {
  if (isIntersecting) fetchReviews()
}

const editModal = reactive({
  rating: 0.5,
  content: "",
  spoiler: false,
  pending: false,
  show: false,
  x: 0,
  y: 0
})

const submitReview = async () => {
  if (!reviews.selected) return
  editModal.pending = true

  $event("modal:review", false)

  await reviewMedia(reviews.selected.media_id, {
    ...editModal
  })

  reviews.selected.content = editModal.content
  reviews.selected.rating = editModal.rating
  reviews.selected.spoiler = editModal.spoiler

  reviews.selected = null
  editModal.pending = false
}

const openDialog = (event: any, review: Review) => {
  reviews.selected = review
  editModal.rating = review.rating
  editModal.content = review.content ?? ""
  editModal.spoiler = review.spoiler ?? false
  editModal.show = !editModal.show

  const rect = event.target.getBoundingClientRect()
  editModal.x = rect.x
  editModal.y = rect.y
}

watch(
  () => reviews.filter,
  () => {
    reviews.page = 1
    reviews.finished = false
    reviews.data = []
    fetchReviews()
  },
  { deep: true }
)

useHead({
  title: user.display_name ? `${user.display_name} (${user.username})` : user.username,
  titleTemplate: "%s Reviews - Masterscore"
})
</script>

<template>
  <div class="preffered-background min-h-screen py-28">
    <div class="container mx-auto max-w-4xl">
      <div class="flex items-start justify-between">
        <PagesUserCard
          :user="user"
          :small="true"
          :text="$t('profile.reviews', user._count.reviews)"
        />

        <PagesUserReviewsFilter :data="reviews.filter" />
      </div>

      <EntertainmentDetailsReviewsModal
        v-if="userStore.user"
        :review="editModal"
        @submit="submitReview"
      />

      <DropdownMenu v-if="isMe" :open="editModal.show" @update:open="(v) => (editModal.show = v)">
        <DropdownMenuTrigger
          :disabled="true"
          class="fixed left-4 top-6"
          :style="`transform: translate(${editModal.x}px, ${editModal.y}px)!important`"
        ></DropdownMenuTrigger>
        <DropdownMenuContent class="w-32">
          <DropdownMenuGroup>
            <DropdownMenuItem
              @click="
                () => {
                  $event('modal:review', true)
                }
              "
            >
              <Icon name="ic:round-edit" class="mr-2 h-5 w-5" />
              <span>{{ $t("edit") }}</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              class="text-red-400"
              @click="
                () => {
                  if (!reviews.selected) return
                  reviews.data = reviews.data.filter((r) => r.id !== reviews.selected?.id)
                  deleteReview(reviews.selected.media_id)
                }
              "
            >
              <Icon name="ic:outline-delete-forever" class="mr-2 h-5 w-5" />
              <span>{{ $t("delete") }}</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <div class="space-y-12 pt-4">
        <div v-for="review in reviews.data" class="relative flex w-full gap-x-6 rounded-lg">
          <div
            v-if="
              reviews.selected && editModal.pending && review.media_id === reviews.selected.media_id
            "
            class="pointer-events-none absolute left-0 top-0 z-10 flex h-full w-full items-center justify-center bg-black bg-opacity-50"
          >
            <Spinner />
          </div>

          <NuxtLink :to="$tlink(review.media)">
            <MasterImage
              :source="$timage(review.media.images.poster || '-', 'w300')"
              :alt="review.media.title"
              class="aspect-poster h-fit w-14 rounded-lg md:w-28"
              :class="{
                '!w-10': !review.content
              }"
            />
          </NuxtLink>

          <div class="relative w-full">
            <div class="flex w-full flex-wrap justify-between gap-x-4 gap-y-1">
              <h3 class="line-clamp-1 text-base font-semibold tracking-tight md:text-xl">
                <NuxtLink :to="$tlink(review.media)">
                  {{ review.media.title }}
                </NuxtLink>
                <span class="ml-2 text-gray-300"
                  >({{ review.media.release_date?.split("-")?.[0] || "-" }})</span
                >
              </h3>
              <div class="flex gap-x-2">
                <ScoreCircle class="w-fit" :score="review.rating" />
              </div>
            </div>

            <EntertainmentDetailsReviewsContent
              v-if="review.content"
              :review="review"
              :skip-info="true"
              class="my-2"
            />
            <time
              class="flex-shrink-0 cursor-default text-xs text-gray-300"
              v-tooltip="{
                content: $moment(review.created_at).locale($i18n.locale).format('LLLL')
              }"
            >
              {{ $moment(review.created_at).locale($i18n.locale).calendar() }}
            </time>
            <button
              v-if="isMe"
              @click="($event) => openDialog($event, review)"
              class="absolute bottom-0 right-0 h-7 w-7 rounded-full transition hover:bg-gray-900"
            >
              <Icon name="mdi:dots-horizontal" class="h-6 w-6" />
            </button>
          </div>
        </div>

        <div class="h-1 w-1" v-intersection-observer="onIntersectionObserver"></div>
        <Spinner v-if="reviews.pending" class="mx-auto" />
      </div>
    </div>
  </div>
</template>
